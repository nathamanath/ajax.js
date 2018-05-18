/**
 * Ajax Promise
 *
 * A tiny wrapper for ajax.js to make it commit to promises.
 */
import Ajax from 'ajax/src/ajax'

/**
 * Proxy to Ajax.request, setting required callbacks
 * Dont you go trying to set Ajax.js callback methiods with this...
 */
export function request(args) {
  return new Promise((resolve, reject) => {
    Ajax.request({
      data: args.data,
      headers: args.headers || {},
      method: args.method || 'GET',
      type: args.type || 'JSON',
      url: args.url,

      // And the required callbacks
      onSuccess: (xhr) => resolve(xhr),
      onError: (xhr) => reject(xhr)
    })
  })
}
