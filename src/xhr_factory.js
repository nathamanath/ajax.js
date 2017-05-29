import { noop } from './utils'

/**
 * setup callbacks for XMLHttpRequest or ActiveXObject
 *
 * @param {XMLHttpRequest|ActiveXObject} xhr - xhr object
 * @param {object} handlers - See XhrFactory.new
 */
const bindStandardEvents = function(xhr, handlers) {

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4) {

      if(xhr.status.toString().match(/^2[0-9]{2}$/)) {
        handlers.onSuccess(xhr)
      } else {
        handlers.onError(xhr)
      }

      handlers.onFinish(xhr)
    }
  }
}

/**
 * setup callbacks for XDomainRequest
 *
 * @param {XDomainRequest} xhr
 * @param {object} handlers - See XhrFactory.new
 */
const bindIeXdomainEvents = function(xhr, handlers) {
  xhr.onload = function() {
    handlers.onSuccess(xhr)
    handlers.onFinish(xhr)
  }

  xhr.onerror = function() {
    handlers.onError(xhr)
    handlers.onFinish(xhr)
  }

  // ie9 fix - onprogress and ontimeout must be set
  xhr.onprogress = noop
  xhr.ontimeout = noop
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
 * openXhr - open xhr request. got to do this before setting callbacks
 *
 * @param {object} xhr - xhr instance
 * @param {string} method - http method
 * @param {string} url - load this url
 */
const openXhr = function(xhr, method, url) {
  xhr.open(method, url, true)
}

/**
 * XhrFactory - xhr request object to suit your ajax requirements
 */
export default {

  /**
   * new xhr object fit for browser and request type
   *
   * @param {object} args - see Ajax.request
   * @param {boolean} [xdomain=false] - is request cross domain?
   * @returns {object} xhr instance
   */
  new: function(args, xdomain=false) {
    let method = args.method
    let url = args.url
    let xhr = new XMLHttpRequest()

    // ie >= 10 and browsers
    if ('withCredentials' in xhr) {

      openXhr(xhr, method, url)
      setHeaders(xhr, args.headers)
      bindStandardEvents(xhr, args)

      return xhr
    }

    // ie9
    if(xdomain) {

      // ie9 xDomain
      let xhr = XDomainRequest()

      openXhr(xhr, method, url)
      bindIeXdomainEvents(xhr, args)

      return xhr

    } else {

      // ie9 local
      let xhr = new ActiveXObject('Msxml2.XMLHTTP')

      openXhr(xhr, method, url)
      setHeaders(xhr, args.headers)
      bindStandardEvents(xhr, args)

      return xhr

    }

    // ie <= 8
    console.error('Ajax.js - Browser not supported.')

  }

}
