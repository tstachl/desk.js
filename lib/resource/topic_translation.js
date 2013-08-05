/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  , destroyMixin = require('../mixins/destroy')
  ;

/*!
 * Expose `TopicTranslation()`.
 */
exports = module.exports = TopicTranslation;

/**
 * Initialize a new `TopicTranslation` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function TopicTranslation(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  this.destroy = destroyMixin;
  TopicTranslation.super_.apply(this, arguments);
}
util.inherits(TopicTranslation, Resource);

TopicTranslation.create = require('../mixins/create');