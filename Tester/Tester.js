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

    fpath = path.resolve(fpath);
    let stats = fs.statSync(fpath);

    if(stats.isDirectory()) {
      return fs.readdirSync(fpath)
                        .filter( file => /.js$/.test(file) )
                        .map( file => require(path.resolve(path.join(fpath, file))));
    } else {
      return [require(fpath)];
    }

  } catch(err) {
    console.error(err.stack);
    throw new Error('Fail to load config files.');
  }
}

function mocha_ajax(scenario, index) {

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

  it(`testing...${testing_options.name}`, function(done) {

    // To Avoid the timeout error, expands the timeout time.
    this.timeout((testing_options.delay + 2000));

    // variable for testing
    let $prev = null
      , $out  = null
    ;
    if(req['variable']) $prev = req['variable'].$prev;

    function ajax(retry = 0, interval = 2000) {
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

            throw new Error(errorFromCallback);
          }

        } else {
          if(err) throw new Error(err);
          expect(res.statusCode).to.be.equal(expectation.statusCode);

          done();
        }

      });
    }

    // delay the request
    setTimeout( ajax.bind(this, ), testing_options.delay);
  });

  return scenario;

}

// Class: Tester
export default class Tester {
  constructor(options = {type: 'folder', path: path.resolve(path.join(__dirname, '..', 'tester_config'))}) {
    try {
      this.type = /^(:?folder|file)$/.test(options.type)? options.type: 'folder';
      this.path = options.path? path.resolve(options.path): path.resolve(path.join(__dirname, '..', 'tester_config'));
      this.scenarioList = getScenarioConfig(options.type, options.path);
    } catch(err) {
      console.error(err.stack);
      throw new Error('constructor error');
    }

  }

  run() {

    let self = this;

    self.scenarioList.forEach( scenario => {

      let scenario_key = Object.keys(scenario)[0];

      describe(`Scenario: ${scenario_key}`, function() {

        let index = 0;
        mocha_ajax.call(this, scenario[scenario_key], index);

        if(index < scenario[scenario_key].length) {
          mocha_ajax.call(this, scenario[scenario_key], ++index);
        }

      });

    });

  }
}
