# Ajax.js - Javascript ajax module

Make ajax requests with ease.

Ajax.js has 0 external dependencies, and works in all proper browsers as well as IE >= 9.

For ie8, see ie8 branch

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

## Development
