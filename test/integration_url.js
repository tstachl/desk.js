
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , integrationUrlHref
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
    password: '12345'
  }
}

function createClient() {
  return desk.createClient({
    subdomain: config.subdomain ,
    username: config.username,
    password: config.password
  })
}

// check if the hack works
describe('IntegrationUrl', function() {
  describe('create', function() {
    it('creates a new integrationUrl', function(done) {
      var client = createClient();
      client.integrationUrls().create({
        name: 'Sample URL',
        description: 'A sample Integration URL',
        markup: 'http://www.example.com'
      }, function(err, integrationUrl) {
        integrationUrl.getName().should.equal('Sample URL');
        integrationUrl.getDescription().should.equal('A sample Integration URL');
        integrationUrlHref = integrationUrl.definition._links.self.href;
        done();
      });
    })
  })

  describe('update', function() {
    it('updates an integration url', function(done) {
      var client = createClient();
      client.integrationUrls().byUrl(integrationUrlHref, function(err, integrationUrl) {
        integrationUrl.update({ name: 'Other Sample URL' }, function(err, integrationUrl) {
          integrationUrl.getName().should.equal('Other Sample URL');
          done();
        });
      });
    })
  })

  describe('delete', function() {
    it('deletes an integration url', function(done) {
      var client = createClient();
      client.integrationUrls().byUrl(integrationUrlHref, function(err, integrationUrl) {
        integrationUrl.destroy(function(err) {
          should.not.exist(err);
          done();
        });
      });
    })
  })
})