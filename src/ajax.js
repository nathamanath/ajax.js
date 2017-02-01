/**
 * Ajax.js - cross browser xhr wrapper
 *
 * Supports ie >= 9 and modern browsers
 *
 * @license - MIT
 * @author - NathanG https://github.com/nathamanath/ajax.js
 */

import XhrFactory from './xhr_factory'
import { noop, merge } from './utils'

/**
 * recognised content types
 */
const CONTENT_TYPES = {
  'URLENCODED': 'application/x-www-form-urlencoded',
  'JSON': 'application/json',
  'XML': 'text/xml'
}

/**
 * @returns {object} default params for requests
 */
const defaultArgs = function() {
  return {
    method: 'GET',
    type: 'JSON',
    headers: {},
    onStart: noop,
    onSuccess: noop,
    onFinish: noop,
    onError: noop
  }
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
const newXhrObject = function(args, xdomain=false) {
  args.headers['Content-Type'] = CONTENT_TYPES[args.type]

  let xhr = XhrFactory.new(args, xdomain)

  // xhr.open(args.method, args.url, true)

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

    args = merge(args, defaultArgs())
    validateArgs(args)

    let xhr = newXhrObject(args)

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

    args = merge(args, defaultArgs())
    validateArgs(args)

    let xhr = newXhrObject(args, true)

    // Fires onstart consistantly pre request
    args.onStart(xhr)

    xhr.send(args.data)
  }

}
