# Ajax.js

Cross browser xhr wrapper for normalised ajax requests.

Ajax.js has 0 external dependencies, and works in all proper browsers as well as
IE >= 9.

## Usage

You can use either the es6 source version of ajax `./src/ajax.js`, or the
compiled es5 version `./dist/ajax.js`. By copying files into your project, or
installing via npm with `npm install git+https://github.com/nathamanath/ajax.js.git`

Basic usage is shown below, further usage examples can be found in `./examples`.

### local requests

The example below shows an example with all options. See jsdocs for defaults.
The only required option is `args.url`.

```javascript

  Ajax.request({
    xdomain: true, // defaults to false
    url: 'http://echo.nathansplace.co.uk/echo?body=echo', // required param
    type: 'JOSN', // this is default type
    method: 'POST', // defaults to GET
    data: JSON.stringify({ example: true }),
    onStart: function(xhr) {
      // xhr is your request object. you can modify it here pre request
      console.log('onStart called!');
    },
    onSuccess: function(xhr) {
      console.log(xhr.responseText);
    },
    onError: function(xhr) {
      console.log('onError called!');
    },
    onFinish: function(xhr) {
      // called after success or error
      console.log('onFinish called!');
    }
  });
```

## Extending ajax

Most times when deploying ajax I write a wrapper object around it to handle any
domain specific requirements like token management for example.

## Development

* run tests with `npm run test`
* build with `npm run build`
* dev mode `npm run dev` watch src, keep build up to date

### TODO

* TODO: run automated tests in real browsers
* TODO: get rid of webpack bloat from es5 build
