# Parameters

## opt
  * `url`
  * `method`: (default: GET)
  * `headers`
  * `json`
  * `qs`
  * `options`: About testing configuration
    - `delay`: (default: 0)
    - `retry`: (default: false)
    - `interval`: (default: 2000)

## expect
  * `statusCode`: (default: 200)
  * `json`: (default: true)
  * `callback(err, res, $out, $prev, done)`
