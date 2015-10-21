import Tester from './Tester/Tester.js';

let argv = require('minimist')(process.argv.slice(2));

let tester = null;

if(argv.type === 'folder' && argv.path === 'default') {
  tester = new Tester();
} else {
  console.log(argv.path.toString());
  tester = new Tester({type: argv.type, path: argv.path});
}

// start to run tests.
tester.run();
