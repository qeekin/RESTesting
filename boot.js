#! /usr/bin/env node

var program = require('commander');
var spawn = require('child_process').spawn;

function run_mocha(type, path) {
  spawn('./node_modules/.bin/mocha', ['--compilers', 'js:babel/register', '--type', type, '--path', path,'app.js'], { stdio: 'inherit' });
}

// define commands
program
  .version('0.0.1')
  .usage('[options] <File/Folder>')
  .option('-f, --file <File>', 'Specify an alternate json file')
  .option('-d, --directory <Dir>', 'Specify an alternate directory')
  .parse(process.argv);

if (program.file) {
  run_mocha('file', program.file);
} else if (program.directory) {
  run_mocha('folder', program.directory);
} else {
  run_mocha('folder', 'default');
}
