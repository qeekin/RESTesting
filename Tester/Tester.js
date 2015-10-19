import path from 'path';
import Promise from 'bluebird';

let debug = require('debug')('Tester');
let fs = Promise.promisifyAll(require('fs'));

async function getScenarioConfig(type, fpath) {
  try {
    fpath = path.resolve(fpath);
    let stats = await fs.statAsync(fpath);
  } catch(err) {
    console.error(err.stack);
    throw new Error('Fail to load config files.');
  }
}

export default class Tester {
  constructor(options = {type: 'folder', path: path.resolve(path.join(__dirname, '..', 'tester_config'))}) {
    this.type = /^(:?folder|file)$/.test(options.type)? options.type: 'folder';
    this.path = options.path? path.resolve(options.path): path.resolve(path.join(__dirname, '..', 'tester_config'));

    this.scenarioList = [];

  }
}
