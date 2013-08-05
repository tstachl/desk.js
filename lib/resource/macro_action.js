/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  ;

/*!
 * Expose `MacroAction()`.
 */
exports = module.exports = MacroAction;

/**
 * Initialize a new `MacroAction` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function MacroAction(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  MacroAction.super_.apply(this, arguments);
}
util.inherits(MacroAction, Resource);