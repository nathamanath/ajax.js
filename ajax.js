(function(root){
  function Ajax(args){
    if(typeof args.url === 'undefined') throw 'Ajax requires a url.';

    var token, noop;

    token = function(){
      var el = document.getElementsByName('csrf-token')[0];

      if(el !== 'undefined' && el != null){
        return el.content;
      }

      return null;
    }

    noop = function(){}

    this.method = args.method || 'GET';
    this.url = args.url;
    this.data = args.data || {};
    this.token = args.token || token();
    this.onSuccess = args.onSuccess || noop;
    this.onError = args.onError || noop;
    this.onStart = args.onStart || noop;
    this.onFinish = args.onFinish || noop;
    this.onTimeout = args.onTimeout || noop;
    this.onAbort = args.onAbort || noop;
    this.onProgress = args.onProgress || noop;

    return this;
  }

  Ajax.request = function(args){
    this.new(args).send();
  }

  Ajax.prototype.send = function(){
    var xhr = this._createRequest();

    this._bindEvents(xhr);
    xhr.send(JSON.stringify(this.data));

    return this;
  }

  Ajax.prototype._createRequest = function(){
    var xhr = new XMLHttpRequest();

    xhr.open(this.method, this.url, true);

    xhr.setRequestHeader('Content-type', 'application/json');
    if(this.token) xhr.setRequestHeader('X-CSRF-Token', token);

    return xhr;
  }

  Ajax.prototype._bindEvents = function(xhr){
    var _this = this;

    xhr.addEventListener('laodstart', this.onStart(xhr), false);
    xhr.addEventListener('laodend', this.onFinish(xhr), false);
    xhr.addEventListener('progress', this.onProgress(xhr), false);
    xhr.addEventListener('error', this.onError(xhr), false);
    xhr.addEventListener('abort', this.onAbort(xhr), false);
    xhr.addEventListener('timeout', this.onTimeout(xhr), false);

    xhr.addEventListener('readystatechange', function(){
      if(this.readyState === 4 && this.status === 200){
        _this.onSuccess(this);
      }
    }, false);
  }

  if(typeof define === 'function' && define.amd){
    define([], function(){return Ajax}); // amd
  }else{
    root.Ajax = Ajax;
  }
}(this));

