# Ajax - Javascript ajax module

So, I use a lot of XMLHttpRequests, but it would be foolish to bring in jQuery
or similar just for that. So here's my own light as I can make it vanilla js Ajax class.

Ajax.js has 0 external dependencies, works in all proper browsers as well as IE >= 8,
and it's require.js /  AMD compatible!

## Usage

```javascript
Ajax.request({
    method: 'POST',
    url: 'http://nathansplace.co.uk',
    data: {
      param: true
    },
    onSuccess: function(){
        alert('It ruddy works!');
    }
});
```

html docs are in ./doc... I'll host these soon.

## Development

### Testing

Tests will run in browser or headless with jasmine

```zsh
$ bundle install
$ rake test
```

