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
 *
 * @param {Object|String} _links The _links part of the desk API response.
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