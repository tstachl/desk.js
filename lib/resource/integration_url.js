/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  , destroyMixin = require('../mixins/destroy')
  ;

/*!
 * Expose `IntegrationUrl()`.
 */
exports = module.exports = IntegrationUrl;

/**
 * Initialize a new `IntegrationUrl` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function IntegrationUrl(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  this.destroy = destroyMixin;
  IntegrationUrl.super_.apply(this, arguments);
}
util.inherits(IntegrationUrl, Resource);

IntegrationUrl.create = require('../mixins/create');