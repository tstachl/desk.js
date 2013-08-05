/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  ;

/*!
 * Expose `Reply()`.
 */
exports = module.exports = Reply;

/**
 * Initialize a new `Reply` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Reply(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  Reply.super_.apply(this, arguments);
}
util.inherits(Reply, Resource);

Reply.create = require('../mixins/create');