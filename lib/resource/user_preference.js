/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  ;

/*!
 * Expose `UserPreference()`.
 */
exports = module.exports = UserPreference;

/**
 * Initialize a new `UserPreference` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function UserPreference(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  UserPreference.super_.apply(this, arguments);
}
util.inherits(UserPreference, Resource);