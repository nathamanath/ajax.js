(function(window, document, Object) {
  'use strict';

  (function(window, factory) {
    // Expose Ajax
    var define = window.define || null;

    if(typeof define === 'function' && define.amd){
      // AMD
      define('ajax', [], function() {
        return factory();
      });
    }else{
      window.Ajax = factory();
    }
  })(window, function() {

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

    /** @returns {bool} */
    var isLocal = function(url) {
      var a = document.createElement('a');

      a.href = url;

      return a.hostname === window.location.hostname;
    };

    /** @returns {boolean} */
    var isFormData = function(data) {
      return !!data.constructor.toString().match('FormData');
    }

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

    // Cause minification
    var objectKeys = Object.keys;

    /** Default args for ajax request. */
    var defaults = {
      url: null,
      method: 'GET',
      type: 'URLENCODED',
      data: {},
      token: null,
      timeout: 0,
      headers: {}
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
      objectKeys(a).forEach(function(key) {
        b[key] = a[key];
      });

      return b;
    };

    var mergeData = function(a, b) {
      if(isFormData(a)) {
        objectKeys(b).forEach(function(key) {
          a.append(key, b[key]);
        });

        return a;
      } else {
        return merge(b, a);
      }
    };

    /**
     * Take form and turn into js object
     *
     * @param form - form object
     * @returns form data as js object
     */
    var serializeForm = function(form) {
      var fields = form.querySelectorAll('input, textarea, select');

      var out = {};

      [].forEach.call(fields, function(field) {
        var key = field.name;
        var value = field.value;

        if(key) {
          out[key] = value;
        }
      });

      return out;
    }


    /**
     * Represents an ajax request
     *
     * @class Request
     * @private
     * @param {object} args - See Ajax.request
     */
    var Request = function(args) {
      var self = this;

      self.url = args.url || defaults.url;
      self.method = args.method || defaults.method;
      self.type = args.type || defaults.type;
      self.token = args.token || defaults.token || self._getToken();
      self.timeout = args.timeout || defaults.timeout;

      self.headers = merge(args.headers || {}, defaults.headers);

      self.data = self._prepData(args.data);

      CALLBACKS.forEach(function(callback) {
        self[callback] = args[callback] || defaults[callback];
      });
    };

    Request.prototype = {
      init: function() {
        var self = this;

        self._validate();
        self._defaultHeaders();

        self.xhr = xhrFactory(self.url);

        self.xhr.open(self.method, self.url, true);
        self.xhr.timeout = self.timeout;

        self._setRequestHeaders();
        self._bindEvents();

        var xhr = self.xhr;

        self.onStart(xhr);

        return self.xhr.send(self._parseData());
      },

      /**
       * @param data - request data / params
       * @returns data params merged with defaults
       */
      _prepData: function(data) {
        data = data || {};

        if(!!data.constructor.toString().match('HTMLFormElement')) {
          data = serializeForm(data);
        } else {
          data = data;
        }

        return mergeData(data, defaults.data);
      },

      _bindEvents: function() {
        var self = this;
        var xhr = self.xhr;

        xhr.ontimeout = self.onTimeout;

        // TODO: this is a bit nasty
        if(this._xDomainRequest()) {

          xhr.onload = function() {
            self.onSuccess(xhr);
            self.onFinish(xhr);
          };

          xhr.onerror = function() {
            self.onError(xhr);
            self.onFinish(xhr);
          }
        } else {

          xhr.onreadystatechange = function(){
            if(xhr.readyState === 4) {
              if(xhr.status.toString().match(/2[0-9]{1,2}/)) {
                self.onSuccess(xhr);
              } else {
                self.onError(xhr);
              }

              self.onFinish(xhr);
            }
          };
        }
      },

      /** Are we using XDomainRequest object? */
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

        objectKeys(headers).forEach(function(key) {
          self.xhr.setRequestHeader(key, headers[key]);
        });
      },

      _validate: function() {
        if(TYPES.indexOf(this.type) === -1) {
          throw new Error('Ajax: Invalid type');
        }

        if(!this.url && !defaults.url) {
          throw new Error('Ajax: URL required');
        }
      },

      _defaultHeaders: function() {
        var headers = this.headers;
        var token = this.token;

        if(!isFormData(this.data)) {
          headers['Content-Type'] = this._contentType();
        }

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

      /** @returns this.data formatted for request type, this.type */
      _parseData: function() {
        var self = this;
        var data = self.data;

        if(isFormData(data)) {
          return data;
        }

        if(self.type === 'JSON') {
          return JSON.stringify(data);
        } else {
          return self._dataToURLEncoded();
        }
      },

      /** @returns this.data as url encoded params */
      _dataToURLEncoded: function() {
        var data = this.data;

        var out = objectKeys(data).map(function(key) {
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
       * @param {object} [args.data] - Request params as js object, form object, or FormData.
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
