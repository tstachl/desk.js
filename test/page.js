var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , util = require('util')
  , Page = require('../lib/resource/page')
  ;

replay.fixtures = __dirname + '/fixtures';
replay.mode = 'record';
replay.request_headers = [/^accept/, /^content-type/, /^host/, /^if-/, /^x-/];

try {
  config = require('../config');
} catch (err) {
  config = {
    subdomain: 'devel',
    username: 'devel@example.com',
    password: '12345',
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-consumer-secret',
    token: 'your-token',
    tokenSecret: 'your-token-secret'
  }
}

function createClient() {
  return desk.createClient({
    subdomain: config.subdomain ,
    username: config.username,
    password: config.password
  })
}

describe('Page', function() {
  it('has a next page link indicator', function(done) {
    var client = createClient();
    client.cases(function(err, cases) {
      cases.hasNextPage().should.be.ok;
      cases.last(function(err, cases) {
        cases.hasNextPage().should.not.be.ok;
        done();
      });
    });
  })

  it('has a previous page link indicator', function(done) {
    var client = createClient();
    client.cases(function(err, cases) {
      cases.hasPreviousPage().should.not.be.ok;
      cases.last(function(err, cases) {
        cases.hasPreviousPage().should.be.ok;
        done();
      });
    });
  })
})