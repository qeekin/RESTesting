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

function mocha_ajax(scenario, done) {
  // get the first request from a case(scenario).
  let req = scenario.shift();
  console.log('a', req.opt);
  let options = req['opt'];
  let expectation = req['expect'];

  request(options, (err, res, body) => {
    if(err) throw new Error(err);

    expect(err).to.be.null;
    expect(res.statusCode).to.be.equal(expectation.statusCode);

    if(scenario.length > 0) {
      return mocha_ajax(scenario, done);
    } else {
      return done();
    }

  });

  // request(options)
  // .spread( (res, body) => {
  //   console.log('code', res.statusCode);
  //   expect(res.statusCode).to.be.equal(expectation.statusCode);
  //   return;
  // })
  // .catch( err => {
  //   console.error(err.stack);
  //   // throw new Error(err);
  //   return;
  // })
  // .then( () => {
  //   // final
  //   if(scenario.length > 0) {
  //     mocha_ajax(scenario, done);
  //   } else {
  //     done();
  //   }
  // });
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
    describe('case1', function() {
      console.log(self.scenarioList);
      it('testing...', done => {
        mocha_ajax(self.scenarioList[0].case1, done);
      })
    });
  }
}
