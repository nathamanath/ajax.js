# Ajazz - Javascript ajax module

So, I use a lot of XMLHttpRequests, but it would be foolish to bring in jquery
or similar just for that. So heres my own light as I can make it vanilla js Ajax class.

This vanilla javascript Ajax class has 0 dependencies, works in all proper
browsers as well as ie[work out ie version]+, and its AMD compatible!

## Usage:

For require.js, just require ajax.js as you would with any other module. It will
work out whats going on and define itsself as a module.

  Ajax.request({
    method: 'GET',
    url: 'http://nathansplace.co.uk',
    onSuccess: function(){
      alert('It ruddy works!');
    }
  })

