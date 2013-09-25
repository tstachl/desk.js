
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , macroHref
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
describe('Macro', function() {
  describe('create', function() {
    it('creates a new macro', function(done) {
      var client = createClient();
      client.macros().create({
        name: 'Assign to Engineering',
        description: 'It\'s raining fire!'
      }, function(err, macro) {
        macro.getName().should.equal('Assign to Engineering');
        macro.getDescription().should.equal('It\'s raining fire!');
        macroHref = macro.definition._links.self.href;
        done();
      });
    })
  })

  describe('update', function() {
    it('updates a macro', function(done) {
      var client = createClient();
      client.macros().byUrl(macroHref, function(err, macro) {
        macro.update({ name: 'Assign to Engineering and Support' }, function(err, macro) {
          macro.getName().should.equal('Assign to Engineering and Support');
          done();
        });
      });
    })
  })

  describe('delete', function() {
    it('deletes a macro', function(done) {
      var client = createClient();
      client.macros().byUrl(macroHref, function(err, macro) {
        macro.destroy(function(err) {
          should.not.exist(err);
          done();
        });
      });
    })
  })
})