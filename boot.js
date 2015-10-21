var program = require('commander');
var spawn = require('child_process').spawn;

function run_mocha(type, path) {
  spawn('./node_modules/.bin/mocha', ['--compilers', 'js:babel/register', '--type', type, '--path', path,'app.js'], { stdio: 'inherit' });
}

// define commands
program
  .version('0.0.1')
  .usage('[options] <file>')
  .option('-f, --file <file>', 'Specify an alternate json file')
  .option('-d, --directory <dir>', 'Specify an alternate directory')
  .command('tester [file]')
  .action( (file) => {
      if(!file) return;
      console.log('file', file);
  })

program.parse(process.argv);
