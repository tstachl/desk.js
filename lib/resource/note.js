/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  ;

/*!
 * Expose `Note()`.
 */
exports = module.exports = Note;

/**
 * Initialize a new `Note` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Note(parent, definition) {
  Note.super_.apply(this, arguments);
}
util.inherits(Note, Resource);

Note.create = require('../mixins/create');