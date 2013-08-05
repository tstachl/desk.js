/*!
 * Module dependencies
 */

/*!
 * Expose `create()`.
 */
exports = module.exports = create;

/**
 * Creates a new resource.
 *
 * @param {Function} parent The parent this resource should be attached to.
 * @param {String} baseUrl That's needed for sub resources (/api/v2/customers/1/cases).
 * @param {Object} params The params to use for the resource.
 * @param {Function} callback The callback called with the new resource or error.
 * @api public
 */
function create(parent, baseUrl, params, callback) {
  parent.getClient().post(baseUrl, params, function(err, definition, response) {
    if (err) return callback(err);
    callback(null, new this(parent, definition));
  }.bind(this));
}