/** @returns xhr instance */
export default const function(xdomain=false) {
  var xhr = new XMLHttpRequest()

  // ie >= 10 and browsers
  if ('withCredentials' in xhr) {
    return xhr
  }

  // ie9 xDomain
  if(xdomain) {
    return new XDomainRequest()
  }

  // ie9 local
  return new ActiveXObject('Msxml2.XMLHTTP')
}
