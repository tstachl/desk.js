/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  , destroyMixin = require('../mixins/destroy')
  ;

/*!
 * Expose `Topic()`.
 */
exports = module.exports = Topic;

/**
 * Initialize a new `Topic` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Topic(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  this.destroy = destroyMixin;
  Topic.super_.apply(this, arguments);
}
util.inherits(Topic, Resource);

Topic.create = require('../mixins/create');