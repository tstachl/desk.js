/*!
 * Module dependencies
 */
var inflection = require('inflection')
  ;

/*!
 * Expose `delete()`.
 */
exports = module.exports = destroy;

/**
 * Allows a resource to be deleted.
 *
 * @param {Function} callback The callback to call with an error message if there was an error
 * @api public
 */
function destroy(callback) {
  this.getClient().destroy(this.definition._links.self.href, function(err, definition, response) {
    if (err) return callback(err);
    callback();
  }.bind(this));
}