# Tester
## Install

    $ git clone git@gitlab.com:qnap/tester.git
    $ cd tester && npm install
    $ npm link

## Usage

    Usage: tester [options] <File/Folder>

    Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -f, --file <File>      Specify an alternate json file
      -d, --directory <Dir>  Specify an alternate directory

## Uninstall

    $ cd path/tester && npm unlink
    $ rm -r path/tester

## Configuration (`.js`)
  * Default folder: `tester_config/`
  * Format: read  [case2.js](https://gitlab.com/qnap/tester/blob/master/tester_config/case2.js)



## Parameters
### opt

  > [Options of `request`](https://github.com/request/request#requestoptions-callback) module will all be accepted.

  * `url`
  * `method`: (default: GET)
  * `headers`
  * `json`
  * `qs`
  * `options`: About testing configuration
    - `name`: Custom name of task
    - `delay`: (default: 0ms)
    - `retry`: (default: 0)
    - `interval`: (default: 2000ms)
    - `timeout`: set timeout for each task (default: by formula, depends on delay, retry times and interval)

### expect
  * `statusCode`: (default: 200)
  * `json`: If enables this option, it will try to parse output to JSON format. (default: true)
  * `callback(err, res, $out, $prev, done)`

## Issues
