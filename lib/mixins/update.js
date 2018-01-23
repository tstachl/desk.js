/*!
 * Module dependencies
 */
var inflection = require('inflection')
  ;

/*!
 * Expose `_getChangedProperties()` and `update()`.
 */
exports._getChangedProperties = _getChangedProperties;
exports.update = update;

/**
 * Get only changed properties as a hash.
 *
 * @return {Object}
 * @api private
 */
function _getChangedProperties() {
  var retVal = {}, key;
  for (key in this._changed) {
    retVal[key] = this._changed[key];
  }
  return retVal;
}

/**
 * Allows a resource to be updated.
 *
 * @param {Object|Function} properties A hash of fields to be updated or the callback.
 * @param {Function} callback The callback to call with the updated resource or an error message.
 * @api public
 */
function update(properties, callback) {
  if (typeof properties == 'function') {
    callback = properties;
    properties = {};
  }

  var key, changed;
  var exceptions = ['addresses_update_action', 'emails_update_action', 'phone_numbers_update_action'];
  for (key in properties) {
    if ('set' + inflection.camelize(key) in this) {
      this['set' + inflection.camelize(key)](properties[key]);
    } else if(exceptions.indexOf(key) != -1) {
      this._changed[key] = properties[key];
    }
  }

  changed = this._getChangedProperties();
  this.getClient().patch(this.definition._links.self.href, changed, function(err, definition, response) {
    if (err) return callback(err);
    this.definition = definition;
    this._setup();
    callback(null, this);
  }.bind(this));
}
