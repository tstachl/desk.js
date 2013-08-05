/*!
 * Module dependencies
 */
var Resource = require('./')
  , ResourcePrototype = Object.create(Resource.prototype)
  , getResource = require('../mixins/resource')
  , qs = require('qs')
  , _ = require('lodash')
  ;

/*!
 * Expose `Page()`.
 */
exports = module.exports = Page;

/**
 * Initialize a new `Page` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Page(parent, definition) {
  Page.super_.apply(this, arguments);
}
// super can be resource
Page.super_ = Resource;
// page has to inherit from Array
Page.prototype = Object.create(Array.prototype, {
    constructor: {
        value: Page,
        enumerable: true
    }
});
// mixin Resource prototype
for (var fn in ResourcePrototype) {
  Page.prototype[fn] = ResourcePrototype[fn];
}

/**
 * Internal setup will be called within the constructor and on every update.
 *
 * @api private
 */
Page.prototype._setup = function() {
  if (this.length > 0) this.slice(0, this.length);
  if ('_embedded' in this.definition) {
    this.push.apply(this, _.map(this.definition._embedded.entries, function(item) {
      return new (getResource(item._links.self['class']))(this, item);
    }.bind(this)));
  }
  Page.super_.prototype._setup.call(this);
}

/**
 * Get a query param from the current resource.
 *
 * @return {String|Null}
 * @api private
 */
Page.prototype._getQueryParam = function(param) {
  var params = qs.parse(this.definition._links.self.href.split('?')[1]);
  return param in params ? params[param] : null;
}

/**
 * Change query params on the current resource.
 *
 * @api private
 */
Page.prototype._queryParams = function(params) {
  var linkArr = this.definition._links.self.href.split('?');
  linkArr[1]  = qs.stringify(_.merge(params || {}, qs.parse(linkArr[1])));
  this.definition._links.self.href = linkArr.join('?');
}

/**
 * Search the resource.
 *
 * @param {Object} params The search params.
 * @param {Function} callback The callback to use for the search results.
 * @api public
 */
Page.prototype.search = function(params, callback) {
  var baseUrl = this.definition._links.self.href.split('?')[0] + '/search?'
    , resource;
      params = qs.stringify(params);

  resource = new (getResource('page'))(this, { 
    _links: { 
      self: { 
        href: baseUrl + params,
        'class': 'page'
      }
    }
  });
  if (typeof callback == 'function') return resource.exec(callback);
  return resource;
}

/**
 * This method customizes the pagination settings. Unless changed all 
 * customizations will be used for subsequent pages.
 *
 * @param {Number} page The page to load.
 * @api public
 */
Page.prototype.page = function(page) {
  if (!page) return parseInt(this._getQueryParam('page'));
  this._queryParams({ page: page });
  return this;
}

/**
 * This method customizes the pagination settings. Unless changed all 
 * customizations will be used for subsequent pages.
 *
 * @param {Number} perPage The amount of entries per page (max 100).
 * @api public
 */
Page.prototype.perPage = function(count) {
  if (!count) return parseInt(this._getQueryParam('per_page'));
  this._queryParams({ per_page: count });
  return this;
}

/**
 * Find a resource by id.
 *
 * @param {Mixed} id The id of the resource.
 * @api public
 */
Page.prototype.byId = function(id, callback) {
  var baseUrl = this.definition._links.self.href.split('?')[0] + '/' + id;
  this.byUrl(baseUrl, callback);
}