(function(window, document, Object) {
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

    var CALLBACKS = [
      'onStart',
      'onSuccess',
      'onError',
      'onFinish',
      'onTimeout'
    ];

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

    var defaults = {
      url: null,
      method: 'GET',
      type: 'URLENCODED',
      data: {},
      token: null,
      timeout: 0,
      headers: {},
    }

    CALLBACKS.forEach(function(callback) {
      defaults[callback] = noop;
    });

    /**
     * @param {object} a
     * @param {object} b
     * @returns {object} - a merged into b
     */
    var merge = function(a, b) {
      Object.keys(a).forEach(function(key) {
        b[key] = a[key];
      });

      return b;
    };


    /**
     * Represents an ajax request
     *
     * @class Request
     */
    var Request = function(args) {
      var self = this;

      self.xhr = xhrFactory(args.url);

      self.url = args.url || defaults.url;
      self.method = args.method || defaults.method;
      self.type = args.type || defaults.type;
      self.token = args.token || defaults.token || self._getToken();
      self.timeout = args.timeout || defaults.timeout;

      self.headers = merge(args.headers || {}, defaults.headers);
      self.data = merge(args.data || {}, defaults.data);

      CALLBACKS.forEach(function(callback) {
        self[callback] = args[callback] || defaults[callback];
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

      /** Are we using XdomainRequest object? */
      _xDomainRequest: function() {
        return !!this.xhr.constructor.toString().match('XDomainRequest');
      },

      _setRequestHeaders: function() {
        var self = this;

        // no headers for XDomainRequest (ie < 10)  :(
        if(self._xDomainRequest()) {
          return;
        }

        var headers = self.headers;

        Object.keys(headers).forEach(function(key) {
          self.xhr.setRequestHeader(key, headers[key]);
        });
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

        headers['Content-Type'] = this._contentType();

        if(token) {
          headers['X-CSRF-Token'] = token;
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
      /**
       * Makes an ajax request...
       *
       * @static
       * @param {string} args.url - Request url
       * @param {string} [args.method=GET] - Request method. Should be upper case string
       * @param {string} [args.type=URLENCODED] - Request type. Must be `URLENCODED`, or `JSON`.
       * @param {object} [args.data] - Request params as js object.
       * @param {string} [args.token] - Manually set X-CSRF-Token token header.
       * @param {integer} [args.timeout] - Request timeout. Default is no timeout.
       * @param {object} [args.object] - Request headers as key value pairs.
       * @param {function} [args.onStart] - Callback fired at start of request.
       * @param {function} [args.onSuccess] - Callback fired on successful completion of request (2xx response).
       * @param {function} [args.onError] - Callback fired if request response is not in 200 range.
       * @param {function} [args.onTimeout] - Callback fired at if request times out.
       * @param {function} [args.onFinish] - Callback fired after request successful or not.
       */
      request: function(args) {
        return new Request(args).init();
      },

      /**
       * Change defaults for #request
       *
       * @static
       * @param {object} config - Defaults for future calls to #request. Keys are
       * the same as those documented for #request.
       * @returns {object} - new defaults for #request (config merged into defaults)
       */
      configure: function(config) {
        return merge(config, defaults);
      }
    };

  });
})(window, document, Object);
