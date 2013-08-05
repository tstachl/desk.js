/*!
 * Module dependencies
 */
var inflection = require('inflection')
  ;

/*!
 * Expose `delete()`.
 */
exports = module.exports = deleteMethod;

/**
 * Allows a resource to be deleted.
 *
 * @param {Function} callback The callback to call with an error message if there was an error
 * @api public
 */
function deleteMethod(callback) {
  this.getClient().delete(this.definition._links.self.href, function(err, definition, response) {
    if (err) return callback(err);
    callback();
  }.bind(this));
}