(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Ajax", [], factory);
	else if(typeof exports === 'object')
		exports["Ajax"] = factory();
	else
		root["Ajax"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhr_factory = __webpack_require__(3);

var _xhr_factory2 = _interopRequireDefault(_xhr_factory);

var _utils = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * recognised content types
 */
/**
 * Ajax.js - cross browser xhr wrapper
 *
 * Supports ie >= 9 and modern browsers
 *
 * @license - MIT
 * @author - NathanG https://github.com/nathamanath/ajax.js
 */

var CONTENT_TYPES = {
  'URLENCODED': 'application/x-www-form-urlencoded',
  'JSON': 'application/json',
  'XML': 'text/xml'
};

/**
 * @returns {object} default params for requests
 */
var defaultArgs = function defaultArgs() {
  return {
    method: 'GET',
    type: 'JSON',
    headers: {},
    onStart: _utils.noop,
    onSuccess: _utils.noop,
    onFinish: _utils.noop,
    onError: _utils.noop
  };
};

/**
 * validate args object
 *
 * @param {object} args - args object from request or xDomianRequest
 */
var validateArgs = function validateArgs(args) {
  // URL is required
  if (!args.url) throw new Error('Ajax: args.url required');

  // content type must be recognised
  if (Object.keys(CONTENT_TYPES).indexOf(args.type) === -1) {
    throw new Error('Ajax: args.type not recognised');
  }
};

/**
 * @returns new mostly configured xhr instance. request type specific config is
 * added in request method
 */
var newXhrObject = function newXhrObject(args) {
  var xdomain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  args.headers['Content-Type'] = CONTENT_TYPES[args.type];

  var xhr = _xhr_factory2.default.new(args, xdomain);

  // xhr.open(args.method, args.url, true)

  return xhr;
};

exports.default = {
  /**
   * Makes a local ajax request.
   *
   * @static
   * @param {string} args.url - Request url
   * @param {string} [args.method=GET] - Request method. Should be upper case string
   * @param {string} [args.type=JSON] - Request type. Must be `URLENCODED`, `XML`, or `JSON`.
   * @param {object} [args.data] - Request data. passed directly to xhr.send
   * @param {object} [args.headers] - Request headers as key value pairs.
   * @param {function} [args.onStart] - Callback fired at start of request.
   * @param {function} [args.onSuccess] - Callback fired on successful completion of request (2xx response).
   * @param {function} [args.onError] - Callback fired if request response is not in 200 range.
   * @param {function} [args.onFinish] - Callback fired after request successful or not.
   */
  request: function request(args) {

    args = (0, _utils.merge)(args, defaultArgs());
    validateArgs(args);

    var xhr = newXhrObject(args);

    // Fires onStart consistantly pre request
    args.onStart(xhr);

    xhr.send(args.data);
  },

  /**
   * Makes a cross domain ajax request
   * ** Note - no headers for XDomainRequest ie < 10  :( **
   * @param {object} args - see Ajax.request for params
   */
  xDomainRequest: function xDomainRequest(args) {

    args = (0, _utils.merge)(args, defaultArgs());
    validateArgs(args);

    var xhr = newXhrObject(args, true);

    // Fires onstart consistantly pre request
    args.onStart(xhr);

    xhr.send(args.data);
  }

};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Utility functions
 */

/**
 * Merge object a into object b
 *
 * @param {object} a
 * @param {object} b
 * @returns {object} - a merged into b
 */
var merge = exports.merge = function merge(a, b) {
  var out = b;

  Object.keys(a).forEach(function (key) {
    out[key] = a[key];
  });

  return out;
};

/**
 * no operation
 */
var noop = exports.noop = function noop() {};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(2);

/**
 * setup callbacks for XMLHttpRequest or ActiveXObject
 *
 * @param {XMLHttpRequest|ActiveXObject} xhr - xhr object
 * @param {object} handlers - See XhrFactory.new
 */
var bindStandardEvents = function bindStandardEvents(xhr, handlers) {

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {

      if (xhr.status.toString().match(/2[0-9]{1,2}/)) {
        handlers.onSuccess(xhr);
      } else {
        handlers.onError(xhr);
      }

      handlers.onFinish(xhr);
    }
  };
};

/**
 * setup callbacks for XDomainRequest
 *
 * @param {XDomainRequest} xhr
 * @param {object} handlers - See XhrFactory.new
 */
var bindIeXdomainEvents = function bindIeXdomainEvents(xhr, handlers) {
  xhr.onload = function () {
    handlers.onSuccess(xhr);
    handlers.onFinish(xhr);
  };

  xhr.onerror = function () {
    handlers.onError(xhr);
    handlers.onFinish(xhr);
  };

  // ie9 fix - onprogress and ontimeout must be set
  xhr.onprogress = _utils.noop;
  xhr.ontimeout = _utils.noop;
};

/**
 * set headers on xhr instance from object. object keys are header name, values
 * are header values
 *
 * @param {object} xhr - any form of xhr instance provided by XhrFactory
 * @param {object} headers - key value pairs of request headers
 */
var setHeaders = function setHeaders(xhr, headers) {
  Object.keys(headers).forEach(function (key) {
    xhr.setRequestHeader(key, headers[key]);
  });
};

/**
 * openXhr - open xhr request. got to do this before setting callbacks
 *
 * @param {object} xhr - xhr instance
 * @param {string} method - http method
 * @param {string} url - load this url
 */
var openXhr = function openXhr(xhr, method, url) {
  xhr.open(method, url, true);
};

/**
 * XhrFactory - xhr request object to suit your ajax requirements
 */
exports.default = {

  /**
   * new xhr object fit for browser and request type
   *
   * @param {object} args - see Ajax.request
   * @param {boolean} [xdomain=false] - is request cross domain?
   * @returns {object} xhr instance
   */
  new: function _new(args) {
    var xdomain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var method = args.method;
    var url = args.url;
    var xhr = new XMLHttpRequest();

    // ie >= 10 and browsers
    if ('withCredentials' in xhr) {

      openXhr(xhr, method, url);
      setHeaders(xhr, args.headers);
      bindStandardEvents(xhr, args);

      return xhr;
    }

    // ie9
    if (xdomain) {

      // ie9 xDomain
      var _xhr = XDomainRequest();

      openXhr(_xhr, method, url);
      bindIeXdomainEvents(_xhr, args);

      return _xhr;
    } else {

      // ie9 local
      var _xhr2 = new ActiveXObject('Msxml2.XMLHTTP');

      openXhr(_xhr2, method, url);
      setHeaders(_xhr2, args.headers);
      bindStandardEvents(_xhr2, args);

      return _xhr2;
    }

    // ie <= 8
    console.error('Ajax.js - Browser not supported.');
  }

};

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Used when compiling es5 version with webpack
                                                                                                                                                                                                                                                                               * Provides module definition for ES6(ES2015) module system, commonjs or amd if
                                                                                                                                                                                                                                                                               * present. Otherwise makes Ajax a global object.
                                                                                                                                                                                                                                                                               */

var _ajax = __webpack_require__(0);

var _ajax2 = _interopRequireDefault(_ajax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function webpackUniversalModuleDefinition(root, factory) {

  if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') {
    module.exports = factory();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    exports["Ajax"] = factory();
  } else {
    root["Ajax"] = factory();
  }
})(undefined, function () {
  return _ajax2.default;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)(module)))

/***/ })
/******/ ]);
});