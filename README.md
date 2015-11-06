# Tester
  Simple RESTful flow testing tool

## Install

    $ git clone https://github.com/qeekin/RESTesting.git
    $ cd tester && npm install
    $ npm link

## Usage

### Run in the default folder(`tester_config/`)

    $ tester

  * Only Accept json files which types are single scenario.

### Run in a specify folder

    $ tester -d <path>/tester_config/

  * Only Accept json files which types are single scenario.

### Run with a specify file

    // single scenario
    $ tester -f <path>/scenario.json

    // multiple scenarios
    $ tester -m <path>/scenarios.json

### Generate a json file from url

    $ tester gen <url> -o <output.json>

  * output file name must be suffixes with `.json`

### Help
      Usage: tester [options] <File/Folder>


      Commands:

      gen [options] <url>  Create a json file from the url

      Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -f, --file <File>      Specify an alternate json file
      -m, --multi <File>     Specify an alternate json file with multi scenarios
      -d, --directory <Dir>  Specify an alternate directory

## Uninstall

    $ cd <path>/tester && npm unlink
    $ rm -r <path>/tester

## Configuration (`.json`)
  * Default folder: `tester_config/`
  * Format: read  
    * [case_short.json ](https://gitlab.com/qnap/tester/blob/master/tester_config/case_short.json)(single scenario, use `-f`)
    * [case_multi.json](https://gitlab.com/qnap/tester/blob/master/tester_config/case_multi.json)(multiple scenarios, use `-m`)




## Parameters
### opt

  > [Options of `request`](https://github.com/request/request#requestoptions-callback) module will all be accepted.

  * `url`: request url
  * `method`: (default: GET)
  * `headers`: http headers
  * `json`: input json
  * `qs`: query string
  * `options`: About testing configuration
    - `name`: Custom name of task
    - `delay`: (default: 0ms)
    - `retry`: (default: 0)
    - `interval`: (default: 2000ms)
    - `timeout`: set timeout for each task (default: by formula, depends on delay, retry times and interval)

### expect
  * `statusCode`: (default: 200)
  * `json`: If enables this option, it will try to parse output to JSON format. (default: true)
  * `callback(err, res, $out, $prev, next)`: Customized expectation. A String likes javascript syntax (without function declaration).

          // example
          "callback": "if( $out.total_current == 1 \n&& $out.current[0].id ==3) \n  next(); \nelse \n  throw \"error\";"

    * `err`: Actually error in the request
    * `res`: Complete response in the request
    * `$out`: Result of the response
    * `$prev`: Previous result of the response
    * `next`: Must be called if the task wants to be passed.

## Issues
