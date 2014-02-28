# Ajax - Javascript ajax module

So, I use a lot of XMLHttpRequests, but it would be foolish to bring in jquery
or similar just for that. So heres my own light as I can make it vanilla js Ajax class.

Ajax.js has 0 dependencies, works in all proper browsers as well as ie[9 i think
but not tested yet, will make it work in 8]+, and its require.js /  AMD compatible!

## Usage:

For require.js, just require ajax.js as you would with any other module. It will
work out whats going on and define itsself as a module.

    Ajax.request({
        method: 'GET',
        url: 'http://updates.html5rocks.com',
        onSuccess: function(){
            alert('It ruddy works!');
        }
    });

html docs are in ./docs... ill host these soon.

## Testing

Tests will run in browser or headless with mocha-phantomjs

    mocha-phantomjs -R dot test/index.html

## TODO

* Cross browser testing especialy ie
* Make it work in ie 8

