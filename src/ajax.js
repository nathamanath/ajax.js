/**
 * Ajax.js - xmlhttp wrapper
 * @lisence Ajax.js - https://github.com/nathamanath/ajax.js/blob/master/LISENCE
 */

import XhrFactory from './xhr_factory'

import {merge} from './utils'

/**
 * Default args for ajax requests. Can be changed via Ajax.configure/1
 */
let defaultArgs = {
  url: null,
  method: 'GET',
  type: 'JSON',
  data: {},
  timeout: 0,
  headers: {}
}










/**
 * Ajax public interface
 * @class Ajax
 */
export default {

  /**
   * Set defaults for ajax requests
   * @param args - to be merged with defaultArgs
   */
  configure: function(args={}) {
    defaultArgs = merge(args, defaultArgs)
  },

  /**
   * Ajax request
   */
  request: function() {

  },

  /**
   * Cross domain ajax request
   */
  xDomainRequest: function() {}
}
