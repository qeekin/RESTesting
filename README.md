# Parameters

## opt

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

## expect
  * `statusCode`: (default: 200)
  * `json`: If enables this option, it will try to parse output to JSON format. (default: true)
  * `callback(err, res, $out, $prev, done)`

# Issues
