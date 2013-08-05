/*!
 * Module dependencies
 */
var util = require('util')
  , Resource = require('./')
  ;

/*!
 * Expose `Job()`.
 */
exports = module.exports = Job;

/**
 * Initialize a new `Job` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Job(parent, definition) {
  Job.super_.apply(this, arguments);
}
util.inherits(Job, Resource);

Job.create = require('../mixins/create');