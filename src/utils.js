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
export const merge = function(a, b) {
  let out = b

  Object.keys(a).forEach(function(key) {
    out[key] = a[key]
  })

  return out
}

/**
 * no operation
 */
export const noop = function() { }
