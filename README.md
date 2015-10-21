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
    - `delay`: (default: 0)
    - `retry`: (default: false)
    - `interval`: (default: 2000)

## expect
  * `statusCode`: (default: 200)
  * `json`: (default: true)
  * `callback(err, res, $out, $prev, done)`
