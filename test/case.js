
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

describe('Case create', function() {
  it('creates a case from cases resource', function(done) {
    var client = createClient();
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
    }, function(err, kase) {
      kase.getSubject().should.equal('Some Subject');
      done();
    })
  })

  it('returns a validation error if fields are missing', function(done) {
    var client = createClient();
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
    }, function(err, kase) {
      console.log(err);
      kase.getSubject().should.equal('Some Subject');
      done();
    })
  })
})

describe('Case update', function() {
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

describe('Case Message', function() {
  it('shows the case message', function(done) {
    var client = createClient();
    client.cases().perPage(1).exec(function(err, cases) {
      cases[0].message(function(err, message) {
        message.getDirection().should.equal('in');
        message.getCreatedAt().should.equal('2013-05-09T17:02:16Z');
        done();
      })
    })
  })
})