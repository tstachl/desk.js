/*!
 * Module dependencies
 */
var getResource = require('./resource')
  ;

/*!
 * Expose `search()`.
 */
exports = module.exports = search;

/**
 * Searches a resource.
 *
 * @param {Function} parent The parent this resource should be attached to.
 * @param {String} baseUrl That's needed for sub resources (/api/v2/customers/1/cases).
 * @param {Function} callback The callback called with the new resource or error.
 * @api public
 */
function search(parent, baseUrl, callback) {
  var resource = new (getResource('page'))(parent, {
    _links: { self: { href: baseUrl, 'class': 'page' } }
  });
  
  if (typeof callback == 'function') return resource.exec(callback);
  return resource;
}