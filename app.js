import Tester from './Tester/Tester.js';

let argv = require('minimist')(process.argv.slice(2));

let tester = null;

try {
  if(argv.type === 'folder' && argv.path === 'default') {
    tester = new Tester();
  } else {
    console.log(argv.path.toString());
    tester = new Tester({type: argv.type, path: argv.path});
  }
} catch(err) {
  console.log('Fail to load config files.');
  process.exit();
}

// start to run tests.
tester.run();
