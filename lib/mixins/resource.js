/*!
 * Module dependencies
 */
var resources = {}
  ;

/*!
 * Expose `getResource()`.
 */
exports = module.exports = getResource;

/**
 * Get or require the resource based on the class name.
 *
 * @param {String} name The class name for this resource.
 * @return {Function}
 * @api private
 */
function getResource(name) {
  if (name in resources) return resources[name];
  try { return resources[name] = require('../resource/' + name); }
  catch(err) { return resources[name] = require('../resource'); }
}