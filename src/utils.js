/**
 * @param {object} a
 * @param {object} b
 * @returns {object} - a merged into b
 */
export const merge = function(a, b) {
  objectKeys(a).forEach(function(key) {
    b[key] = a[key]
  })

  return b
}

export const noop = function() {}
