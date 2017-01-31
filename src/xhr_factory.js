/**
 * xhr request object factory
 */
export default {

  /**
   * new xhr object fit for browser and request type
   *
   * @param {boolean} [xdomain=false] - is request cross domain?
   * @returns {object} xhr instance
   */
  new: function(xdomain=false) {
    var xhr = new XMLHttpRequest()

    // ie >= 10 and browsers
    if ('withCredentials' in xhr) {
      return xhr
    }

    // ie9 xDomain
    if(xdomain) {
      return new XDomainRequest()
    } else {
      // ie9 local
      return new ActiveXObject('Msxml2.XMLHTTP')
    }

    // ie <= 8
    console.error('Ajax.js - Browser not supported.')
    
  }
}
