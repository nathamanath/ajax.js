# Ajax.js

Cross browser xhr wrapper for normalised ajax requests.

Tested in:

* ie >= 9,
* edge,
* chrome,
* firefox,
* safari.

## Usage

You can use either the es6 source version of ajax `./src/ajax.js`, or the
compiled es5 version `./dist/ajax.js`. Basic usage is shown below, further usage
examples can be found in `./examples`.

### local requests

The example below shows an example with all options. See jsdocs for defaults.
The only required option is `args.url`.

```javascript

  Ajax.request({
    url: '/path', // required param
    type: 'JOSN', // this is default type
    method: 'POST', // defaults to GET
    data: JSON.stringify({ example: true }),
    onStart: function(xhr) {
      // xhr is your request object. you can modify it here
      console.log('onStart called!');
    },
    onSuccess: function(xhr) {
      console.log('onSuccess called!');
    },
    onError: function(xhr) {
      console.log('onError called!');
    },
    onFinish: function(xhr) {
      console.log('onFinish called!');
    }
  });
```

### cross domain requests

Use `Ajax.xDomainRequest` to make cross domain requests. It takes the same arguments
as `Ajax.request`.

```javascript

  // Cross domain example using less options
  Ajax.xDomainRequest({
    url: 'http://echo.nathansplace.co.uk/echo',
    type: 'JOSN', // this is default type
    method: 'POST',
    // TODO: is stringify needed
    data: JSON.stringify({ status: 418, body: { message: "I am a teapot!" } }),
    onError: function(xhr) {
      var message = JSON.parse(xhr.responseText).message;
      alert(message)
    }
  });
```

## Extending ajax

Most times when deploying ajax I write a wrapper object around it to handle any
domain specific requirements like token management for example.

The following example includes the value found in the csrf meta tag as a header
with each request:

```javascript
  //TODO: nice short example wrapper
```

See `./examples` for more usage examples.

## Development

* run tests with `npm run test`
* build with `npm run build`
* dev mode `npm run dev` watch src, keep build up to date

TODO: run automated tests in real browsers
TODO: get rid of webpack bloat from es5 build
