/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , deleteMixin = require('../mixins/delete')
  ;

/*!
 * Expose `Attachment()`.
 */
exports = module.exports = Attachment;

/**
 * Initialize a new `Attachment` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Attachment(parent, definition) {
  this.delete = deleteMixin;
  Attachment.super_.apply(this, arguments);
}
util.inherits(Attachment, Resource);

Attachment.create = require('../mixins/create');