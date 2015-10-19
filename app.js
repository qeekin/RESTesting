import program from 'commander';
import Tester from './Tester/Tester.js';

// define commands
program
  .version('0.0.1')
  .option('-f, --file', 'Specify an alternate json file')
  .option('-d, --directory', 'Specify an alternate directory')
  .command('tester [dir]')
  .action( (dir) => {
      if(!dir) return;
      console.log('dir', dir);
  })

program.parse(process.argv);

console.log('f', program.file);
console.log('g', program.directory);
