
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , caseUrl;

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

describe('Case', function() {
  beforeEach(function(done){
    var client = createClient()
      , params = {
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
        subject: 'Some Subject',
        from: 'support@desk.com',
        to: 'support@devel.com'
      },
      _links: {
        customer: {
          href: '/api/v2/customers/34290812',
          'class': 'customer'
        }
      }
    };

    client.post('/api/v2/cases', params, function(err, json, response) {
      caseUrl = json._links.self.href;
      done();
    });
  })

  it('can be updated using the setters', function(done) {
    var client = createClient();
    client.cases().byUrl(caseUrl, function(err, kase) {
      kase.setSubject('New Subject');
      kase.update(function(err, kase) {
        kase.getSubject().should.be.equal('New Subject');
        done();
      });
    });
  })

  it('can be updated using a property hash', function(done) {
    var client = createClient();
    client.cases().byUrl(caseUrl, function(err, kase) {
      kase.update({ subject: 'New Subject' }, function(err, kase) {
        kase.getSubject().should.be.equal('New Subject');
        done();
      });
    });
  })
})