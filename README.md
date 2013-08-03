# desk.js [![Build Status](https://secure.travis-ci.org/tstachl/desk.js.png)](http://travis-ci.org/visionmedia/desk.js)

This is a node.js wrapper for the desk.com API. It'll only support APIv2 which is currently in heavy development, changes happen nearly twice to three times a week. For this wrapper we'll try to keep up with all the changes but things might break unexpectedly.

Now for the fun part ...

## Example
This is a basic example of how to create a client and establish a connection. It shows the four request methods supported by the desk.com API (`GET`, `POST`, `PATCH` and `DELETE`).

```javascript
var desk = require('desk')
  , client = desk.createClient({
  subdomain: 'devel',
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

This is by no means complete and still a work in progress.

## License

(The MIT License)

Copyright (c) 2013 Thomas Stachl &lt;tom@desk.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.