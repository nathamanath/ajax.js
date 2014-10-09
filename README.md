# Ajax.js - Javascript ajax module

Make ajax requests with ease.

Ajax.js has 0 external dependencies, and works in all proper browsers as well as IE
>= 8.

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

