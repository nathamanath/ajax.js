# Ajax.js - Javascript ajax module

Make ajax requests with ease.

Ajax.js has 0 external dependencies, and works in all proper browsers as well as IE >= 9.

#### For ie8, see ie8 branch

## Usage

The `Ajax` object has only 1 method; `request`. It makes ajax requests.

### Example

```javascript
Ajax.request({
    method: 'POST',
    headers: { key: 'value' },
    url: 'http://nathansplace.co.uk',
    data: {
      key: 'value'
    },
    onSuccess: function(){
        alert('It ruddy works!');
    }
});
```

Heres some jsdoc for `Ajax.request` params:

```
  * @param {string} args.url - Request url
  * @param {string} [args.method=GET] - Request method. Should be upper case string
  * @param {string} [args.type=URLENCODED] - Request type. Must be `URLENCODED`, or `JSON`.
  * @param {object} [args.data] - Request params as js object.
  * @param {string} [args.token] - Manually set X-CSRF-Token token header.
  * @param {integer} [args.timeout] - Request timeout. Default is no timeout.
  * @param {object} [args.headers] - Request headers as key value pairs.
  * @param {function} [args.onStart] - Callback fired at start of request.
  * @param {function} [args.onSuccess] - Callback fired on successful completion of request (2xx response).
  * @param {function} [args.onError] - Callback fired if request response is not in 200 range.
  * @param {function} [args.onTimeout] - Callback fired at if request times out.
  * @param {function} [args.onFinish] - Callback fired after request successful or not.
```

* The only required param is `args.url`.
* `X-CSRF-Token` meta tag is detected and used to create token header unless overriden in `args`.
* The first and only argument passed to all callbacks is the js request object.
* `XDomainRequest` does not allow custom headers. (only affects ie9 cross domain requests).

## Development

### TODO:

* Add method to parse form object to params.
* Should callback params be passed a normalized request object? - test in ie 9
* Allow for file uploads in moddern browsers.
* `args.data` should optionaly take `FormData` instance
* multipart/form-data
