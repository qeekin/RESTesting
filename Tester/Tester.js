import path from 'path';
import Promise from 'bluebird';
import chai, {expect} from 'chai';

let debug = require('debug')('Tester');
let fs = Promise.promisifyAll(require('fs'));
// let request = Promise.promisify(require('request'));
import request from 'request';

// private functions
function getScenarioConfig(type, fpath) {
  try {
    console.log('Config path:', fpath);
    fpath = path.resolve(fpath);
    let stats = fs.statSync(fpath);

    if(stats.isDirectory()) {
      return fs.readdirSync(fpath)
                        .filter( file => /\.json$/.test(file) )
                        .map( file => require(path.resolve(path.join(fpath, file))));
    } else {
      if(stats.isFile() && /\.json$/.test(fpath)) {
        if (type === 'file') {
          return [require(fpath)];
        } else {
          let obj = require(fpath);
          return obj['result'];
        }
      }
      return [];
    }

  } catch(err) {
    // process.exit();
    // console.error(err.stack);
    throw new Error('Fail to load config files.');
  }
}

function mocha_ajax(scenario, index) {

  let self = this;

  // get the first request from a case(scenario).
  let req = scenario[index];

  let options = req['opt'];

  let testing_options = options.options || {};
  testing_options.delay = testing_options.delay || 0;
  testing_options.name = testing_options.name || index;
  testing_options.retry = testing_options.retry || 0;
  testing_options.interval = testing_options.interval || 2000;

  let expectation = req['expect'];
  expectation.statusCode = expectation.statusCode || 200;
  expectation.json = expectation.json !== false;
  // let content of callback to be a function.
  if(expectation.callback) {
    try {
      expectation.callback = new Function('err', 'res', '$out', '$prev', 'next', expectation.callback);
    } catch(err) {
      throw new Error('callback property has wrong format.');
    }
  }

  it(`testing...${testing_options.name}`, function(done) {

    // To Avoid the timeout error, expands the timeout time.
    let timeout = testing_options.timeout || ((testing_options.retry + 1) * testing_options.interval + testing_options.delay + 2000);
    this.timeout(timeout);

    // variable for testing
    let $prev = null
      , $out  = null
    ;
    if(req['variable']) $prev = req['variable'].$prev;

    function ajax() {
      request(options, (err, res, body) => {

        if(expectation.json && body) {
          try {
            $out = JSON.parse(body);
          } catch(err) {
            $out = body;
          }
        } else {
          $out = body;
        }

        if(index < scenario.length-1) {
          // set next variables
          scenario[index+1]['variable'] = {};
          scenario[index+1]['variable'].$prev = $out;
        }

        if(req['variable']) req['variable'].$out = $out;

        if( expectation.callback && (typeof expectation.callback) === 'function' ) {
          if(!err) expect(res.statusCode).to.be.equal(expectation.statusCode);

          try {
            expectation.callback(err, res, $out, $prev, done);
          } catch(errorFromCallback) {
            // retry the request
            if(testing_options.retry > 0) {
              testing_options.retry--;
              testing_options.delay = 0;
              // testing_options.name = 'retry ' + testing_options.name;

              console.log(`retry ${testing_options.name}`);

              // retry
              setTimeout(ajax.bind(self), testing_options.interval);
            } else {
              console.log('Input:', options);
              console.log('Output:', $out);

              // must throw it to trigger error task of mocha.
              throw new Error(errorFromCallback);
            }

          }

        } else {
          if(err) throw new Error(err);
          expect(res.statusCode).to.be.equal(expectation.statusCode);

          done();
        }

      });
    }

    // delay the request
    setTimeout( ajax.bind(self), testing_options.delay);
  });

  return scenario;

}

// Class: Tester
export default class Tester {
  constructor(options = {type: 'folder', path: path.resolve(path.join(process.cwd(), 'tester_config'))}) {
    try {
      this.type = /^(:?folder|file|multi)$/.test(options.type)? options.type: 'folder';
      this.path = options.path? path.resolve(options.path): path.resolve(path.join(__dirname, '..', 'tester_config'));
      this.scenarioList = getScenarioConfig(options.type, options.path);

      // test
      // let json = require('../tester_config/case.json');
      // this.scenarioList = json.result;

    } catch(err) {
      // console.error(err.stack);
      throw new Error('constructor error');
    }

  }

  run() {

    let self = this;

    self.scenarioList.forEach( scenario => {

      let scenario_key = Object.keys(scenario)[0];

      describe(`Scenario: ${scenario_key}`, function() {

        let index = 0;
        scenario[scenario_key].forEach( task => {
          mocha_ajax.call(this, scenario[scenario_key], index++);
        });

      });

    });

  }
}
