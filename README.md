# desk.js [![Build Status](https://secure.travis-ci.org/tstachl/desk.js.png)](http://travis-ci.org/tstachl/desk.js) [![Coverage Status](https://coveralls.io/repos/tstachl/desk.js/badge.png)](https://coveralls.io/r/tstachl/desk.js) [![Dependency Status](https://gemnasium.com/tstachl/desk.js.png)](https://gemnasium.com/tstachl/desk.js)

This is a node.js wrapper for the desk.com API (it might also work in the browser but only with either a proxy or from a desk.com case template). It'll only support APIv2 which is currently in heavy development, changes happen nearly twice to three times a week. We'll try to keep up with all the changes but things might break unexpectedly.

Now for the fun part ...

## Example
This is a basic example of how to create a client and establish a connection. It shows the four request methods supported by the desk.com API (`GET`, `POST`, `PATCH` and `DELETE`).

```javascript
var desk = require('desk.js')
  , client = desk.createClient({
  subdomain: 'devel',
  // optional include only if you use a custom domain - see below for details
  endpoint: 'https://support.example.com',
  // use it with basic auth
  username: 'devel@example.com',
  password: '12345',
  // use it with oauth
  consumerKey: 'this-is-my-consumer-key',
  consumerSecret: 'and-my-consumer-secret',
  token: 'my-access-token',
  tokenSecret: 'my-token-secret'
  // add a request logger
  logger: console,
  // allow retry
  retry: true
});

client.get('/api/v2/cases', function(err, json, response) {
  if (err) throw err;
  // the json is the response body already parsed
});

client.post('/api/v2/cases', myNewCaseHash, function(err, json, response) {
  if (err) throw err;
  // the json is the response body already parsed
});

client.patch('/api/v2/cases/1', { subject: 'New Subject' }, function(err, json, response) {
  if (err) throw err;
  // the json is the response body already parsed
});

// for resources like articles we also allow delete
client.delete('/api/v2/articles/1', function(err, response) {
  if (err) throw err;
  // response.statusCode === 201
});
```

## Working with Resources and Collections

This wrapper also allows you to work with collections and resources, follow associations and more ...

### Finders
```javascript
// find a resource by url
client.cases().byUrl('/api/v2/cases/1', function(err, myCase) {
  if (err) throw err;
  // use myCase
});

// find a resource by id
client.cases().byId(1, function(err, myCase) {
  if (err) throw err;
  // use myCase
});
```

### Pagination
```javascript
// fetch the first page of the users collection
client.users(function(err, users) {
  // the result is an array with additional functions
  users.last(function(err, users) {
    // users is now pointed to the last page
    users.first(function(err, users) {
      // back to the first page
    });
  });
});

// you can also specify the pagination directly
client.users().perPage(10).page(5).exec(function(err, users) {
  // users would now be an array of user 51 - 60
  users.next(function(err, users) {
    // now it would be user 61 - 70
    users.previous(function(err, users) {
      // and we are back
    });
  });
});
```

We also support indicators now, so on any page you are you can check if that page has a next/previous page.

```javascript
// fetch the first page of the cases collection
client.cases(function(err, cases) {
  // if we have more than 30 (default page size) cases
  // a check for a next page will be true
  cases.hasNextPage() === true;
  // however the first page will never have a previous page
  cases.hasPreviousPage() === false;
  // this turns on the last page
  cases.last(function(err, cases) {
    // we won't have a next page
    cases.hasNextPage() === false;
    // but we'll have a previous page
    cases.hasPreviousPage() === true;
  });
});
```

Pagination is pretty obvious but the cool part about pagination or rather resources is the auto-linking. As soon as the resource has a link defined, it'll be navigatable:

```json
{
  "_links": {
    "self": {
      "href": "/api/v2/cases/1",
      "class": "case"
    },
    "message": {
      "href": "/api/v2/cases/1/message",
      "class": "message"
    },
    "customer": {
      "href": "/api/v2/customers/1",
      "class": "customer"
    },
    "assigned_user": {
      "href": "/api/v2/users/2",
      "class": "user"
    },
    "assigned_group": {
      "href": "/api/v2/groups/1",
      "class": "group"
    },
    "locked_by": null
  }
}
```

```javascript
client.cases(function(err, cases) {
  cases[0].customer(function(err, customer) {
    // now you can use the customer
    // you could do an update
    customer.update({ first_name: 'John', last_name: 'Doe' }, function(err, customer) {
      console.log(customer.getFirstName());
      // => John
    });
  });
});
```

### Create, Update and Delete
`desk.js` supports create, update and delete methods on resources. However if the API doesn't allow for example deletion, it won't be a method on the resource.

```javascript
/**
 * Create
 */
client.articles().create({
  subject: 'Some Subject',
  body: 'Some Body',
  _links: {
    topic: {
      href: '/api/v2/topics/1',
      'class': 'topic'
    }
  }
}, function(err, article) {
  article.getSubject().should.equal('Some Subject');
  article.getBody().should.equal('Some Body');
});

/**
 * Update
 */
client.articles(function(err, articles) {
  articles[0].update({
    subject: 'Some other Subject'
  }, function(err, article) {
    // use article
  });
});

/**
 * Delete
 */
client.articles(function(err, articles) {
  articles[0].delete(function(err) {
    if (err) throw err;
    continue;
  });
});

/**
 * ATTENTION: Case doesn't allow deletion.
 */
client.cases().byId(25, function(err, myCase) {
  myCase.delete();
  // => Error: No method delete defined on Object Case.
});
```

### Getters & Setters
For each field on the resource it'll automatically create getters and setters:

```javascript
client.customers().byId(1, function(err, customer) {
  console.log(customer.getFirstName());
  console.log(customer.getLastName());
  console.log(customer.getTitle());
  // ...

  // for updates you can either use the setters
  customer.setFirstName('John');
  customer.update(function(err, customer) {})
  // or a hash
  customer.update({ first_name: 'John' }, function(err, customer) {})
});
```

### Custom Domains
If your desk.com site [uses a custom domain](https://support.desk.com/customer/portal/articles/1548-how-to-use-your-own-domain-for-the-portal), you should use that URL as the basis for your api calls.  If you set the endpoint property when creating your desk.com client, it will use this domain instead of the subdomain value to construct the URL.  The URL should be a fully qualified path to your site (e.g. https://yoursupportsite.com)

```javascript
var desk = require('desk')
  , client = desk.createClient({
  // Specify to use a custom domain
  endpoint: 'https://support.example.com',
  // use it with basic auth
  username: 'devel@example.com',
  password: '12345',
  // use it with oauth
  consumerKey: 'this-is-my-consumer-key',
  consumerSecret: 'and-my-consumer-secret',
  token: 'my-access-token',
  tokenSecret: 'my-token-secret'
  // add a request logger
  logger: console,
  // allow retry
  retry: true
});
```

### API Errors
Sometimes the API is going to return errors, eg. Validation Error. In these cases we bubble the API error through to the callback so you can deal with it however you please.

```javascript
client.cases().create({
  external_id: null,
  subject: 'Some Subject',
  priority: 5,
  description: 'Some Description',
  status: 'new',
  type: 'email',
  labels: ['ignore', 'spam'],
  language: null,
  custom_fields: {},
  message: {
    direction: 'in',
    status: 'received',
    body: 'Some Body',
    subject: 'Some Subject'
  },
  _links: {
    customer: {
      href: '/api/v2/customers/34290812',
      'class': 'customer'
    }
  }
}, function(err, myCase) {
  console.log(err.message);
  // => Message requires to, cc or bcc fields to be set to a non-blank value
});
```

## License

Copyright (c) 2013-2014, Salesforce.com, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of Salesforce.com nor the names of its contributors may be
    used to endorse or promote products derived from this software without
    specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
