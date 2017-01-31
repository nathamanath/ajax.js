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
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xhr_factory = __webpack_require__(3);

var _xhr_factory2 = _interopRequireDefault(_xhr_factory);

var _utils = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * default params for requests
 */
/**
 * Ajax.js - cross browser xhr wrapper
 *
 * Supports ie >= 9 and modern browsers
 *
 * @license - MIT
 * @author - NathanG https://github.com/nathamanath/ajax.js
 */

var DEFAULT_ARGS = {
  method: 'GET',
  type: 'JSON',
  data: '',
  headers: {},
  onStart: _utils.noop,
  onSuccess: _utils.noop,
  onFinish: _utils.noop,
  onError: _utils.noop
};

/**
 * recognised content types
 */
var CONTENT_TYPES = {
  'URLENCODED': 'application/x-www-form-urlencoded',
  'JSON': 'application/json',
  'XML': 'text/xml'
};

/**
 * set headers on xhr instance from object. object keys are header name, values
 * are header values
 *
 * @param {object} xhr - any form of xhr instance provided by XhrFactory
 * @param {object} headers - key value pairs of request headers
 */
var setHeaders = function setHeaders(xhr, headers) {
  // No headers for ie9 xdomain
  if (xhr.constructor !== XDomainRequest) {
    Object.keys(headers).forEach(function (key) {
      xhr.setRequestHeader(key, headers[key]);
    });
  }
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

  var xhr = _xhr_factory2.default.new(xdomain);
  var headers = args.headers;

  headers['Content-Type'] = CONTENT_TYPES[args.type];

  xhr.open(args.method, args.url, true);

  setHeaders(xhr, headers);

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

    args = (0, _utils.merge)(args, DEFAULT_ARGS);
    validateArgs(args);

    var xhr = newXhrObject(args);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        // Successful
        if (xhr.status.toString().match(/2[0-9]{1,2}/)) {
          args.onSuccess(xhr);
        } else {
          args.onError(xhr);
        }

        args.onFinish(xhr);
      }
    };

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

    args = (0, _utils.merge)(args, DEFAULT_ARGS);
    validateArgs(args);

    var xhr = _xhr_factory2.default.new(true);
    var headers = args.headers;

    headers['Content-Type'] = CONTENT_TYPES[args.type];
    // ie9 fix - onprogress must be set


    xhr.open(args.method, args.url, true);

    xhr.timeout = 0;

    setHeaders(xhr, headers);

    xhr.onload = function () {
      args.onSuccess(xhr);
      args.onFinish(xhr);
    };

    xhr.onerror = function () {
      args.onError(xhr);
      args.onFinish(xhr);
    };

    xhr.onprogress = _utils.noop;
    xhr.ontimeout = _utils.noop;

    // Fires onstart consistantly pre request
    args.onStart(xhr);

    // fix for ie9 xdomain. Thanks Jolyon
    global.setTimeout(function () {
      xhr.send(args.data);
    }, 0);
  }

};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

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
/**
 * xhr request object factory
 */
exports.default = {

  /**
   * new xhr object fit for browser and request type
   *
   * @param {boolean} [xdomain=false] - is request cross domain?
   * @returns {object} xhr instance
   */
  new: function _new() {
    var xdomain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var xhr = new XMLHttpRequest();

    // ie >= 10 and browsers
    if ('withCredentials' in xhr) {
      return xhr;
    }

    // ie9 xDomain
    if (xdomain) {
      return new XDomainRequest();
    } else {
      // ie9 local
      return new ActiveXObject('Msxml2.XMLHTTP');
    }

    // ie <= 8
    console.error('Ajax.js - Browser not supported.');
  }
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
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