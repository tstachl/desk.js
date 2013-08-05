/*!
 * Module dependencies
 */
var getResource = require('./resource')
  , inflection = require('inflection')
  ;

/*!
 * Expose `link()`.
 */
module.exports = link;

/**
 * Link handles the _links part of the HAL response and sets up the associations.
 * It is used by the client to setup the initial resources like `users`, `cases` and
 * so on, as well as by the resource object itself for sub resources (`cases().replies()`).
 *
 * @param {Object} defintion The defintion of the desk.com API resource.
 * @api public
 */
function link(definition) {
  var key, link, newResource, Resource;

  if ('_links' in definition) {
    for (key in definition._links) {
      if (key === 'self') continue;
      link  = definition._links[key];
      key = key.charAt(0) + inflection.camelize(key).slice(1);

      // resources like next, previous can be null
      if (link === null) {
        this[key] = _buildFunction(null);
        continue;
      }

      // this is a really ugly hack but necessary for sub resources which aren't declared consistently
      if (inflection.singularize(key) !== key && link['class'] === inflection.singularize(key))
        link['class'] = 'page'

      newResource = new (getResource(link['class']))(this, { _links: { self: link }});
      this[key] = _buildFunction(newResource);
    }
  }
}

/**
 * Builds the function for the resource.
 *
 * @param {Object|Null} resource The resource for the getter.
 * @return {Function}
 * @api private
 */
function _buildFunction(resource) {
  return function(callback) {
    if (typeof callback == 'function') {
      if (resource !== null) return resource.exec.call(resource, callback);
      else return callback(null, null);
    }
    return resource;
  }
}