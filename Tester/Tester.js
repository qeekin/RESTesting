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
  it(`testing...${index}`, done => {

    // get the first request from a case(scenario).
    // let req = scenario.shift();
    let req = scenario[index];

    let options = req['opt'];
    let expectation = req['expect'];

    // variable for testing
    let $prev = null
      , $out  = null
    ;
    if(req['variable']) $prev = req['variable'].$prev;

    return request(options, (err, res, body) => {

      if(index < scenario.length-1) {
        // set next variables
        scenario[index+1]['variable'] = {};
        scenario[index+1]['variable'].$prev = body;
      }

      $out = body;
      if(req['variable']) req['variable'].$out = $out;

      if( expectation.callback && (typeof expectation.callback) === 'function' ) {
        if(!err) expect(res.statusCode).to.be.equal(expectation.statusCode);
        expectation.callback(err, res, $out, $prev, done);
      } else {
        if(err) throw new Error(err);
        expect(res.statusCode).to.be.equal(expectation.statusCode);

        done();
      }

    });
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
        mocha_ajax(scenario[scenario_key], index);

        if(index < scenario[scenario_key].length) {
          mocha_ajax(scenario[scenario_key], ++index);
        }

      });

    });

  }
}
