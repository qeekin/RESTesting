import path from 'path';
import Promise from 'bluebird';

let debug = require('debug')('Tester');
let fs = Promise.promisifyAll(require('fs'));
let request = Promise.promisify(require('request'));

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
  let req = scenario.shift();

  let options = req[opt];

  request(options)
  .spread( (res, body) => {
    
    return;
  })
  .catch( err => {
    console.error(err.stack);
    return;
  })
  .then( () => {
    // final
    if(scenario.length > 0) {
      mocha_ajax(scenario, done);
    } else {
      done();
    }
  });
}

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
    // describe('test', function() {
    //   it('should run', () => {
    //     return request('http://localhost:3001/')
    //     .spread( (res, body) => {
    //       console.log(body);
    //     })
    //     .catch( err => {
    //       console.log(err.stack);
    //     });
    //   })
    // });
  }
}
