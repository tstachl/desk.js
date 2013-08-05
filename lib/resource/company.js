/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  ;

/*!
 * Expose `Company()`.
 */
exports = module.exports = Company;

/**
 * Initialize a new `Company` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Company(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  Company.super_.apply(this, arguments);
}
util.inherits(Company, Resource);

Company.create = require('../mixins/create');