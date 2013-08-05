/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  ;

/*!
 * Expose `Customer()`.
 */
exports = module.exports = Customer;

/**
 * Initialize a new `Customer` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Customer(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  Customer.super_.apply(this, arguments);
}
util.inherits(Customer, Resource);

Customer.create = require('../mixins/create');
Customer.search = require('../mixins/search');