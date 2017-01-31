/**
 * Ajax.js - cross browser xhr wrapper
 *
 * Supports ie >= 9 and modern browsers
 *
 * @license - MIT
 * @author - NathanG https://github.com/nathamanath/ajax.js
 */

 // TODO: run in browsers

import XhrFactory from './xhr_factory'
import { noop, merge } from './utils'

/**
 * default params for requests
 */
const DEFAULT_ARGS = {
  method: 'GET',
  type: 'JSON',
  data: {},
  headers: {},
  onStart: noop,
  onSuccess: noop,
  onFinish: noop,
  onError: noop
}

/**
 * recognised content types
 */
const CONTENT_TYPES = {
  'URLENCODED': 'application/x-www-form-urlencoded',
  'JSON': 'application/json',
  'XML': 'text/xml'
}

/**
 * set headers on xhr instance from object. object keys are header name, values
 * are header values
 *
 * @param {object} xhr - any form of xhr instance provided by XhrFactory
 * @param {object} headers - key value pairs of request headers
 */
const setHeaders = function(xhr, headers) {
  Object.keys(headers).forEach(function(key) {
    xhr.setRequestHeader(key, headers[key])
  })
}

/**
 * validate args object
 *
 * @param {object} args - args object from request or xDomianRequest
 */
const validateArgs = function(args) {
  // URL is required
  if(!args.url) throw new Error('Ajax: args.url required')

  // content type must be recognised
  if(Object.keys(CONTENT_TYPES).indexOf(args.type) === -1){
    throw new Error('Ajax: args.type not recognised')
  }
}

/**
 * @returns new mostly configured xhr instance. request type specific config is
 * added in request method
 */
const newXhrObject = function(args) {
  let xhr = XhrFactory.new()
  let headers = args.headers

  headers['Content-Type'] = CONTENT_TYPES[args.type]

  xhr.open(args.method, args.url, true)

  setHeaders(xhr, headers)

  xhr.timeout = 0

  return xhr
}

export default {
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
  request: function(args) {

    args = merge(args, DEFAULT_ARGS)
    validateArgs(args)

    let xhr = newXhrObject(args)

    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4) {
        // Successful
        if(xhr.status.toString().match(/2[0-9]{1,2}/)) {
          args.onSuccess(xhr)
        } else {
          args.onError(xhr)
        }

        args.onFinish(xhr)
      }
    }

    // Fires onStart consistantly pre request
    args.onStart(xhr)

    xhr.send(args.data)
  },

  /**
   * Makes a cross domain ajax request
   * ** Note - no headers for XDomainRequest ie < 10  :( **
   * @param {object} args - see Ajax.request for params
   */
  xDomainRequest: function(args) {

    args = merge(args, DEFAULT_ARGS)
    validateArgs(args)

    let xhr = newXhrObject(args)

    xhr.onload = function() {
      args.onSuccess(xhr)
      args.onFinish(xhr)
    };

    xhr.onerror = function() {
      args.onError(xhr)
      args.onFinish(xhr)
    };

    // ie9 fix - onprogress must be set
    xhr.onprogress = noop

    // Fires onstart consistantly pre request
    args.onStart(xhr)

    // fix for ie9 xdomain. Thanks Jolyon
    window.setTimeout(function() {
      xhr.send(args.data)
    }, 0)
  }

}
