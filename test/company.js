
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , companyHref
  ;

replay.fixtures = __dirname + '/fixtures';
replay.mode = 'record';
replay.request_headers = [/^accept/, /^content-type/, /^host/, /^if-/, /^x-/];

try {
  config = require('../config/test');
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
describe('Company', function() {
  describe('create', function() {
    it('creates a new company on a case', function(done) {
      var client = createClient();
      client.companies().create({
        name: 'Some Company Inc.'
      }, function(err, company) {
        company.getName().should.equal('Some Company Inc.');
        companyHref = company.definition._links.self.href;
        done();
      });
    })
  })

  describe('update', function() {
    it('updates replies on cases', function(done) {
      var client = createClient();
      client.companies().byUrl(companyHref, function(err, company) {
        company.update({ name: 'Some Other Company Inc.' }, function(err, company) {
          company.getName().should.equal('Some Other Company Inc.');
          done();
        });
      });
    })
  })
})