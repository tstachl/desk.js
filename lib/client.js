/*!
 * Module dependencies
 */
var request = require('request')
  , async = require('async')
  , fs = require('fs')
  , collection = require('./collection')
  ;

/*!
 * Expose `createClient()`.
 */
exports.createClient = createClient;

/**
 * Create a desk client.
 *
 * Options:
 *
 *   - `subdomain` the desk.com subdomain to use
 *   - `username` username for basic authentication
 *   - `password` password for basic authentication
 *   - `consumerKey` consumer key for the oauth application
 *   - `consumerSecret` secret for the oauth application
 *   - `token` the token for the oauth authentication
 *   - `tokenSecret` secret for the oauth authentication
 *   - `retry` retry request on 429 and 503
 *   - `logger` logging function to use for request logging
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
function createClient(options) {
  return new Client(options);
}

/**
 * Initialize a new `Client` with the given `options`.
 *
 * Options:
 *
 *   - `subdomain` the desk.com subdomain to use
 *   - `username` username for basic authentication
 *   - `password` password for basic authentication
 *   - `consumerKey` consumer key for the oauth application
 *   - `consumerSecret` secret for the oauth application
 *   - `token` the token for the oauth authentication
 *   - `tokenSecret` secret for the oauth authentication
 *   - `retry` retry request on 429 and 503
 *   - `logger` logging function to use for request logging
 *
 * @param {Object} options
 * @api private
 */
function Client(options) {
  options = options || {};

  this.isClient = true;
  this.subdomain = options.subdomain;
  if (!this.subdomain) throw new Error('No subdomain was specified.');
  this.baseUrl = 'https://' + this.subdomain + '.desk.com';
  
  if (options.username && options.password) {
    this.auth = { username: options.username, password: options.password, sendImmediately: true };
  } else if (options.consumerKey && options.consumerSecret && options.token && options.tokenSecret) {
    this.auth = {
      consumerKey: options.consumerKey,
      consumerSecret: options.consumerSecret,
      token: options.token,
      tokenSecret: options.tokenSecret
    }
  } else {
    throw new Error('No authentication specified, use either Basic Authentication or OAuth.');
  }

  this.retry = options.retry || false;
  this.maxRetry = options.maxRetry || 3;
  this.logger = options.logger || null;
  this.queue = async.queue(this.request.bind(this), 60);

  this.setupCollections();
}

/**
 * Looks up the resources directory and attaches all the resources found.
 *
 * @api private
 */
Client.prototype.setupCollections = function() {
  var resources = fs.readdirSync(__dirname + '/resources')
    , item, i, definition;

  for (i = 0; i < resources.length; i++) {
    item = resources[i];
    if (/\.json$/.test(item)) {
      definition = JSON.parse(fs.readFileSync(__dirname + '/resources/' + item, 'utf-8'));
      collection.createCollection(this, definition);
    }
  }
}

/**
 * Check the response for known errors and retry the request if possible
 *
 * Options:
 *
 *   - `method` GET|POST|PATCH|DELETE depending on request
 *   - `url` the request url (without the baseUrl)
 *   - `payload` data for the request
 *   - `retryCount` a counter to keep track of the times we retried
 *   - `callback` the callback will be called with the response
 *
 * @param {Function} callback The async queue callback to start the next item.
 * @param {Object} options The request options.
 * @param {Function} err Error object from the response.
 * @param {Function} response The response object.
 * @param {Object} body The response body.
 * @api private
 */
Client.prototype.onResponse = function(callback, options, err, response, body) {
  if (err) {
    if (err.code === 'ECONNRESET' || err.message === 'socket hang up') {
      if (this.retry && options.retryCount <= this.maxRetry) return this.doRetry(options, callback);
    } else if (err.statusCode && err.statusCode === 503) {
      if (this.retry && options.retryCount <= this.maxRetry) return this.doRetry(options, callback);
    } else {
      callback(); // clears the item from the queue
      return options.callback && options.callback(err);
    }
  }

  if (response.statusCode === 429) {
    if (this.retry && options.retryCount <= this.maxRetry) {
      return this.doRetry(options, callback, parseInt(response.headers['x-retry-after'] || 10, 10) * 1000);
    } else {
      callback(); // clears the item from the queue
      return options.callback('error', new Error('Too many requests.'));
    }
  } else {
    callback(); // clears the item from the queue
    return options.callback(null, body, response);
  }
}

/**
 * Re-enqueue the request after a specified timeout.
 *
 * Options:
 *
 *   - `method` GET|POST|PATCH|DELETE depending on request
 *   - `url` the request url (without the baseUrl)
 *   - `payload` data for the request
 *   - `retryCount` a counter to keep track of the times we retried
 *   - `callback` the callback will be called with the response
 *
 * @param {Object} options The request options.
 * @param {Function} callback The callback keeps track of the queue. 
 * @param {Number} timeout The timeout before we retry the request.
 * @api private
 */
Client.prototype.doRetry = function(options, callback, timeout) {
  timeout = timeout || 5000;
  
  options.retryCount = options.retryCount || 0;
  options.retryCount += 1;

  setTimeout(function() {
    this.request(options, callback);
  }.bind(this), timeout);
}

/**
 * Run HTTP request
 *
 * Options:
 *
 *   - `method` GET|POST|PATCH|DELETE depending on request
 *   - `url` the request url (without the baseUrl)
 *   - `payload` data for the request
 *   - `retryCount` a counter to keep track of the times we retried
 *   - `callback` the callback will be called with the response
 *
 * @param {Object} options
 * @api private
 */
Client.prototype.request = function(options, callback) {
  if (this.logger) {
    this.logger.trace('DESK REQUEST - [' + options.method + '] ' + this.baseUrl + options.url);
    if (options.payload) this.logger.trace('DESK PAYLOAD: ' + JSON.stringify(options.payload, null, 4));
  }

  request({
    url: options.url.indexOf('https') === 0 ? options.url : this.baseUrl + options.url,
    method: options.method,
    auth: this.auth.username ? this.auth : null,
    oauth: this.auth.token ? this.auth : null,
    json: true,
    body: options.payload || null
  }, async.apply(this.onResponse.bind(this), callback, options));
}

/**
 * Execute a `GET` request
 *
 * #### Example:
 *
 *      var client = desk.createClient(hash);
 *      client.get('/api/v2/cases', {}, function(err, body, response) {
 *        if (err) throw err;
 *        // do something with the body hash
 *      });
 *
 * @param {String} url The request path `/api/v2/cases`.
 * @param {Function} callback The callback will be called with 3 arguments `err`, `body` and `response`.
 * @api public
 */
Client.prototype.get = function(url, callback) {
  this.queue.push({
    method: 'GET',
    url: url,
    callback: callback
  });
}

/**
 * Execute a `POST` request
 *
 * #### Example:
 *
 *      var client = desk.createClient(hash);
 *      var newCase = { subject: 'This is a new case' };
 *      client.post('/api/v2/cases', newCase, {}, function(err, body, response) {
 *        if (err) throw err;
 *        // do something with the body hash
 *      });
 *
 * @param {String} url The request path `/api/v2/cases`.
 * @param {Object} payload A hash that'll be posted to the url.
 * @param {Function} callback The callback will be called with 3 arguments `err`, `body` and `response`.
 * @api public
 */
Client.prototype.post = function(url, payload, callback) {
  this.queue.push({
    method: 'POST',
    url: url,
    payload: payload,
    callback: callback
  });
}

/**
 * Execute a `PATCH` request
 *
 * #### Example:
 *
 *      var client = desk.createClient(hash);
 *      var caseUpdate = { subject: 'This is a new case' };
 *      client.patch('/api/v2/cases/1', caseUpdate, {}, function(err, body, response) {
 *        if (err) throw err;
 *        // do something with the body hash
 *      });
 *
 * @param {String} url The request path `/api/v2/cases`.
 * @param {Object} payload A hash that'll be posted to the url.
 * @param {Function} callback The callback will be called with 3 arguments `err`, `body` and `response`.
 * @api public
 */
Client.prototype.patch = function(url, payload, callback) {
  this.queue.push({
    method: 'PATCH',
    url: url,
    payload: payload,
    callback: callback
  });
}

/**
 * Execute a `DELETE` request
 *
 * #### Example:
 *
 *      var client = desk.createClient(hash);
 *      client.delete('/api/v2/cases/1', {}, function(err, body, response) {
 *        if (err) throw err;
 *        // do something with the body hash
 *      });
 *
 * @param {String} url The request path `/api/v2/cases`.
 * @param {Function} callback The callback will be called with 3 arguments `err`, `body` and `response`.
 * @api public
 */
Client.prototype.delete = function(url, callback) {
  this.queue.push({
    method: 'DELETE',
    url: url,
    callback: callback
  });
}
