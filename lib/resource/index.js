/*!
 * Module dependencies
 */
var linkMixin = require('../mixins/link')
  , inflection = require('inflection')
  , getResource = require('../mixins/resource')
  ;

/*!
 * Expose `Resource()`.
 */
exports = module.exports = Resource;

/**
 * Initialize a new `Resource` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Resource(parent, definition) {
  this.parent = parent;
  this.definition = definition;

  // add mixins
  this._link = linkMixin;

  this._setup();
}

/**
 * Internal setup will be called within the constructor and on every update.
 *
 * @api private
 */
Resource.prototype._setup = function() {
  this._link(this.definition);
  for (var key in this.definition) {
    if (key.indexOf('_') !== 0) {
      this['get' + inflection.camelize(key)] = this._getter(key);
      this['set' + inflection.camelize(key)] = this._setter(key);
    }
  }
  this._changed = {};
}

/**
 * Creates a getter function for the specified key.
 *
 * @param {String} key The field name for the getter.
 * @return {Function}
 * @api private
 */
Resource.prototype._getter = function(key) {
  return function() {
    if (key in this._changed) return this._changed[key]
    return this.definition[key];
  }
}

/**
 * Creates a setter function for the specified key.
 *
 * @param {String} key The field name for the setter.
 * @return {Function}
 * @api private
 */
Resource.prototype._setter = function(key) {
  return function(value) {
    if (key in this.definition && this.definition[key] !== value) {
      this._changed[key] = value;
    }
    return this;
  }
}

/**
 * Executes the current state of the resource.
 *
 * @param {Function} callback The function to call with the new page.
 * @api public
 */
Resource.prototype.exec = function(callback) {
  this.getClient().get(this.definition._links.self.href, function(err, definition, response) {
    if (err) return callback(err);
    if (response.statusCode === 204) return callback();
    this.definition = definition;
    this._setup();
    callback(null, this);
  }.bind(this));
}

/**
 * Traverses back up and returns the client.
 *
 * @api public
 */
Resource.prototype.getClient = function() {
  if (this.parent.isClient) return this.parent;
  else return this.parent.getClient();
}

/**
 * Find a resource by url.
 *
 * @param {String} url The url of the resource.
 * @api public
 */
Resource.prototype.byUrl = function(url, callback) {
  var resource = new (getResource('index'))(this, { _links: { self: { href: url }}});
  resource.exec(function(err, resource) {
    if (err) return callback(err);
    resource = new (getResource(resource.definition._links.self['class']))(this, resource.definition);
    callback(err, resource);
  }.bind(this));
}