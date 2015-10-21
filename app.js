import Tester from './Tester/Tester.js';

let argv = require('minimist')(process.argv.slice(2));

let tester = new Tester();
tester.run();
