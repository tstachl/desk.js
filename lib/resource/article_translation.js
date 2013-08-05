/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  ;

/*!
 * Expose `ArticleTranslation()`.
 */
exports = module.exports = ArticleTranslation;

/**
 * Initialize a new `ArticleTranslation` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function ArticleTranslation(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  ArticleTranslation.super_.apply(this, arguments);
}
util.inherits(ArticleTranslation, Resource);

ArticleTranslation.create = require('../mixins/create');