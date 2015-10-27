#! /usr/bin/env node

var program = require('commander');
var spawn = require('child_process').spawn;
var request = require('request');
var path = require('path');
var url = require('url');

function gen_json(objs) {

}

function run_mocha(type, fpath) {
  var mocha_path = path.resolve(path.join(__dirname, '/node_modules/mocha/bin/mocha'));
  try {
    spawn(mocha_path, ['--compilers', 'js:babel/register', '--type', type, '--path', fpath, path.resolve(path.join(__dirname, 'app.js'))], { stdio: 'inherit' });
  } catch(err) {
    console.error(err);
  }
}

// define commands
program
  .version('0.0.1')
  .usage('[options] <File/Folder>')
  .option('-f, --file <File>', 'Specify an alternate json file')
  .option('-m, --multi', 'Muti scenarios in a json file')
  .option('-d, --directory <Dir>', 'Specify an alternate directory')
  .command('gen [url]')
  .parse(process.argv);

if(program.commands[0].args[0] === 'gen') {
  // if(program.commands[0].args.length > 1) {
  //   // send a request and generate .json files
  //   request.get(program.commands[0].args[1], function(err, res, body){
  //     if(err) return console.log('Bad request');
  //     console.log(body);
  //   });
  // } else {
  //   console.log('Without a url to generate json files');
  // }
} else if (program.file) {
  run_mocha('file', program.file);
} else if (program.directory) {
  run_mocha('folder', program.directory);
} else {
  run_mocha('folder', 'default');
}
