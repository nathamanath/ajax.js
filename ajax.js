(function(window, document) {
  'use strict';

  (function(window, factory) {
    // Expose Ajax
    var define = window.define || null;

    if(typeof define === 'function' && define.amd){ // AMD
      define('ajax', [], function() {
        return factory();
      });
    }else{
      window.Ajax = factory();
    }
  })(window, function() {

    //TODO: Add other common types.
    var CONTENT_TYPES = {
      'URLENCODED': 'application/x-www-form-urlencoded',
      'JSON': 'application/json'
    };

    // ['URLENCODED', 'JSON'...]
    var TYPES = (function(CONTENT_TYPES){
      var out = [];

      for(var key in CONTENT_TYPES){
        if(CONTENT_TYPES.hasOwnProperty(key)){
          out.push(key);
        }
      }

      return out;
    })(CONTENT_TYPES);

    var isLocal = function(url) {
      var a = document.createElement('a');

      a.href = url;

      return a.hostname === window.location.hostname;
    };

    /** @returns xhr instance */
    var xhrFactory = function(url) {
      var xhr = new XMLHttpRequest();

      // ie >= 10 and browsers
      if ('withCredentials' in xhr) {
        return xhr;
      }

      // ie9 xDomain
      if(!isLocal(url)) {
        return new XDomainRequest();
      }

      // ie9 local
      return new ActiveXObject('Msxml2.XMLHTTP');
    };

    var noop = function() {};


    /**
     * Represents an ajax request
     *
     * @class Request
     */
    var Request = function(args) {
      var self = this;

      self.xhr = xhrFactory(args.url);
      self.url = args.url;
      self.method = args.method || 'GET';
      self.type = args.type || TYPES[0];
      self.data = args.data || {};
      self.token = args.token || self._getToken();
      self.timeout = args.timeout || 0;
      self.headers = args.headers || [];

      [
        'onSuccess',
        'onError',
        'onStart',
        'onFinish',
        'onTimeout'
      ].forEach(function(callback) {
        self[callback] = args[callback] || noop;
      });
    };

    Request.prototype = {
      init: function() {
        this._validate();
        this._defaultHeaders();

        this.xhr.open(this.method, this.url, true);
        this.xhr.timeout = this.timeout;

        this._setRequestHeaders();
        this._bindEvents();

        var xhr = this.xhr;

        this.onStart(xhr);

        return this.xhr.send(this._parseData());
      },

      _bindEvents: function() {
        var self = this;
        var xhr = self.xhr;

        xhr.ontimeout = self.onTimeout;

        // TODO: this is a bit nasty
        if(this._xDomainRequest()) {
          xhr.onload = self.onSuccess;
          xhr.onerror = self.onError;
        } else {

          xhr.onreadystatechange = function(){
            var request = this;

            if(request.readyState === 4) {
              if(request.status.toString().match(/2[0-9]{1,2}/)) {
                self.onSuccess(request);
              } else {
                self.onError(request);
              }

              self.onFinish(request);
            }
          };
        }
      },

      /** Are we using XdomainRequest */
      _xDomainRequest: function() {
        return !!this.xhr.constructor.toString().match('XDomainRequest');
      },

      _setRequestHeaders: function() {
        // no headers for XDomainRequest :(
        if(this._xDomainRequest()) {
          return;
        }

        var headers = this.headers;
        var header;

        for(var i = 0, l = headers.length; i < l; i++) {
          header = headers[i];

          this.xhr.setRequestHeader(header.key, header.value);
        }
      },

      _validate: function() {
        if(TYPES.indexOf(this.type) === -1) {
          throw new Error('Ajax: Invalid type');
        }

        if(!this.url) {
          throw new Error('Ajax: URL required');
        }
      },

      _defaultHeaders: function() {
        var headers = this.headers;
        var token = this.token;

        headers.push({ key: 'Content-Type', value: this._contentType() });

        if(token) {
          headers.push({ key:'X-CSRF-Token', value: token });
        }
      },

      _contentType: function() {
        return CONTENT_TYPES[this.type];
      },

      /** look for CSRF token in meta tag */
      _getToken: function() {
        var el = document.getElementsByName('csrf-token')[0];

        if(typeof el !== 'undefined' && el !== null) {
          return el.content;
        }

        return null;
      },

      /** data formatted for request type */
      _parseData: function() {
        if(this.type === 'JSON') {
          return JSON.stringify(this.data);
        } else {
          return this._dataToURLEncoded();
        }
      },

      /** make url params from this.data object */
      _dataToURLEncoded: function() {
        var data = this.data;

        var out = Object.keys(data).map(function(key) {
          return key + '=' + encodeURIComponent(data[key]);
        });

        return out.join('&');
      }
    };

    /** @class Ajax */
    return {
      request: function(args) {
        return new Request(args).init();
      }
    };

  });
})(window, document);
