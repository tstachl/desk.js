
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , labelHref
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

// check if the hack works
describe('Label', function() {
  describe('create', function() {
    it('creates a new label', function(done) {
      var client = createClient();
      client.labels().create({
        name: 'MyLabel',
        description: 'A Test Label',
        types: ['case']
      }, function(err, label) {
        label.getName().should.equal('MyLabel');
        label.getDescription().should.equal('A Test Label');
        labelHref = label.definition._links.self.href;
        done();
      });
    })
  })

  describe('update', function() {
    it('updates a label', function(done) {
      var client = createClient();
      client.labels().byUrl(labelHref, function(err, label) {
        label.update({ name: 'MyNewLabel' }, function(err, label) {
          label.getName().should.equal('MyNewLabel');
          done();
        });
      });
    })
  })

  describe('delete', function() {
    it('deletes a label', function(done) {
      var client = createClient();
      client.labels().byUrl(labelHref, function(err, label) {
        label.destroy(function(err) {
          should.not.exist(err);
          done();
        });
      });
    })
  })
})