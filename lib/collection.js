/*!
 * Module dependencies
 */
var querystring = require('qs')
  ;

/*!
 * Expose `createCollection()`.
 */
exports.createCollection = createCollection;

/**
 * Create a desk collection.
 *
 * @param {Function} parent The parent this collection is attached to.
 * @param {Object} definition The collection definition.
 * @return {Function}
 * @api public
 */
function createCollection(parent, definition) {
  return new Collection(parent, definition);
}

/**
 * Initialize a new `Collection` with the given `parent` and `definition`.
 *
 * @param {Function} parent The parent this resource is attached to.
 * @param {Object} definition The resource definition.
 * @api private
 */
function Collection(parent, definition) {
  this.parent     = parent;
  this.name       = definition.name;
  this.className  = definition['class'];
  this.baseUrl    = definition.base_url;
  this.links      = {};
  this.pagination = { per_page: 50, page: 1 };
  this.definition = definition;

  this.injectIntoParent();

  if (definition.resources) {
    for (var i = 0; i < definition.resources.length; i++) {
      createCollection(this, definition.resources[i]);
    }
  }
}
Collection.prototype = Object.create(Array.prototype);

/**
 * Injects itself into the parent with the collection name as method name.
 *
 * @api private
 */
Collection.prototype.injectIntoParent = function() {
  var self = this;
  this.parent[this.name] = function(callback) {
    if (typeof callback == 'function') { return self.exec(callback); }
    return self;
  }
}

Collection.prototype._exec = function(json, callback) {
  var coll = new Collection(this.parent, this.definition);
  if (json._links) coll._links(json._links);
  if (json._embedded && json._embedded.entries) {
    coll._entries(json._embedded.entries);
  }
  callback(null, coll);
}

/**
 * Takes care about all the _links issues if we have a json response
 *
 * @api private
 */
Collection.prototype._links = function(links) {
  // store all the link objects
  var key, value, currentUrl;
  for (key in links) {
    value = links[key];
    this.links[key] = value ? value.href : value
  }

  // update pagination
  if (this.links.self) {
    currentUrl = this.links.self.split('?');
    if (currentUrl.length > 1) {
      params = querystring.parse(currentUrl[1]);
      this.pagination = {
        page: parseInt(params.page),
        per_page: parseInt(params.per_page)
      };
    }
  }
}

/**
 * Takes care of the entries in the response we got.
 *
 * @api private
 */
Collection.prototype._entries = function(entries) {
  this.push.apply(this, entries);
}

/**
 * Traverses back up and returns the client.
 *
 * @api public
 */
Collection.prototype.getClient = function() {
  if (this.parent.isClient) return this.parent;
  else return this.parent.getClient();
}

/**
 * Traverses back up and returns the resource or collection with the
 * specified name.
 *
 * @param {String} name The name of the resource or collection.
 * @api public
 */
Collection.prototype.getParent = function(name) {
  if (this.parent.name && this.parent.name === name) return this.parent;
  if (this.parent.getParent) return this.parent.getParent(name);
  return null;
}

/**
 * Executes the current pagination changes.
 *
 * @param {Function} callback The function to call with the new collection.
 * @api public
 */
Collection.prototype.exec = function(callback, url) {
  if (url) {
    this.getClient().get(url, function(err, body, response) {
      if (err) return callback(err);
      this._exec(body, callback);
    }.bind(this));
  } else {
    var params = querystring.stringify(this.pagination);
    this.getClient().get(this.baseUrl + '?' + params, function(err, body, response) {
      if (err) return callback(err);
      this._exec(body, callback);
    }.bind(this));
  }
}

/**
 * Get the next page in the collection. If the resource has never been
 * loaded `next()` will load the first page of the collection.
 *
 * @param {Function} callback The function to call with the new collection.
 * @api public
 */
Collection.prototype.next = function(callback) {
  if (!this.links) return this.exec(callback);
  if (this.links.next) {
    this.exec(callback, this.links.next)
  } else {
    callback(null, null);
  }
}

/**
 * Get the previous page in the collection. If the resource has never been
 * loaded `previous()` will load the first page of the collection.
 *
 * @param {Function} callback The function to call with the new collection.
 * @api public
 */
Collection.prototype.previous = function(callback) {
  if (!this.links) return this.exec(callback);
  if (this.links.previous) {
    this.exec(callback, this.links.previous)
  } else {
    callback(null, null);
  }
}

/**
 * Get the first page in the collection. If the resource has never been
 * loaded `first()` will load the first page of the collection.
 *
 * @param {Function} callback The function to call with the new collection.
 * @api public
 */
Collection.prototype.first = function(callback) {
  if (!this.links) return this.exec(callback);
  this.exec(callback, this.links.first)
}

/**
 * Get the last page in the collection. If the resource has never been
 * loaded `last()` will load the first page of the collection.
 *
 * @param {Function} callback The function to call with the new collection.
 * @api public
 */
Collection.prototype.last = function(callback) {
  if (!this.links) return this.exec(callback);
  this.exec(callback, this.links.last)
}

/**
 * This method customizes the pagination settings. Unless changed all 
 * customizations will be used for subsequent collections.
 *
 * @param {Number} page The page to load.
 * @api public
 */
Collection.prototype.page = function(page) {
  if (!page) return this.pagination.page;
  this.pagination.page = page;
  return this;
}

/**
 * This method customizes the pagination settings. Unless changed all 
 * customizations will be used for subsequent collections.
 *
 * @param {Number} perPage The amount of entries per page (max 100).
 * @api public
 */
Collection.prototype.perPage = function(count) {
  if (!count) return this.pagination.per_page;
  this.pagination.per_page = count;
  return this;
}
