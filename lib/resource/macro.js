/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  , destroyMixin = require('../mixins/destroy')
  ;

/*!
 * Expose `Macro()`.
 */
exports = module.exports = Macro;

/**
 * Initialize a new `Macro` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Macro(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  this.destroy = destroyMixin;
  Macro.super_.apply(this, arguments);
}
util.inherits(Macro, Resource);

Macro.create = require('../mixins/create');