/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  , deleteMixin = require('../mixins/delete')
  ;

/*!
 * Expose `Label()`.
 */
exports = module.exports = Label;

/**
 * Initialize a new `Label` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Label(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  this.delete = deleteMixin;
  Label.super_.apply(this, arguments);
}
util.inherits(Label, Resource);

Label.create = require('../mixins/create');