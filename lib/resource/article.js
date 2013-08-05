/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  , updateMixin = require('../mixins/update')
  , deleteMixin = require('../mixins/delete')
  ;

/*!
 * Expose `Article()`.
 */
exports = module.exports = Article;

/**
 * Initialize a new `Article` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Article(parent, definition) {
  var key;
  for (key in updateMixin) {
    this[key] = updateMixin[key];
  }
  this.delete = deleteMixin;
  Article.super_.apply(this, arguments);
}
util.inherits(Article, Resource);

Article.create = require('../mixins/create');
Article.search = require('../mixins/search');