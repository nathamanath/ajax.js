/**
 * Used when compiling es5 version with webpack
 * Provides module definition for ES6(ES2015) module system, commonjs or amd if
 * present. Otherwise makes Ajax a global object.
 */

import Ajax from './ajax'

(function webpackUniversalModuleDefinition(root, factory) {

  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory()
  } else if(typeof define === 'function' && define.amd) {
    define("Ajax", [], factory)
  } else if(typeof exports === 'object') {
    exports["Ajax"] = factory()
  } else {
    root["Ajax"] = factory()
  }

})(this, function() { return Ajax })
