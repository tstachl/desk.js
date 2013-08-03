
var desk = require('../')
  , should = require('should')
  , config = require('config')
  , caseUrl;

describe('Client', function() {
  it('throws an error if no subdomain is defined', function(done) {
    desk.createClient.should.throw(/subdomain/);
    done();
  })

  it('throws an error if no authentication is defined', function(done) {
    (function() {
      desk.createClient({ subdomain: 'devel' });
    }).should.throw(/authentication/);
    done();
  })

  it('accepts username and password authentication', function(done) {
    var client = desk.createClient({
      subdomain: 'devel',
      username: 'test@example.com',
      password: '12345'
    });

    client.auth.username.should.equal('test@example.com');
    client.auth.password.should.equal('12345');

    done();
  })

  it('accepts token and tokenSecret for OAuth', function(done) {
    var client = desk.createClient({
      subdomain: 'devel',
      token: 'my_token',
      tokenSecret: 'my_token_secret',
      consumerKey: 'my_consumer_key',
      consumerSecret: 'my_consumer_secret'
    });

    client.auth.token.should.equal('my_token');
    client.auth.tokenSecret.should.equal('my_token_secret');
    client.auth.consumerKey.should.equal('my_consumer_key');
    client.auth.consumerSecret.should.equal('my_consumer_secret');

    done();
  })

  it('can log requests', function(done) {
    var logger = {
      logs: [],
      trace: function(message) { logger.logs.push(message); }
    };

    var client = desk.createClient({
      subdomain: config.subdomain,
      username: config.username,
      password: config.password,
      logger: logger
    });

    client.get('/api/v2/cases?per_page=1', function() {
      logger.logs.length.should.not.equal(0);
      done();
    });
  })

  it('requests get resources', function(done) {
    var client = desk.createClient({
      subdomain: config.subdomain,
      username: config.username,
      password: config.password
    });

    client.get('/api/v2/cases?per_page=1', function(err, json, response) {
      response.should.have.status(200);
      done();
    });
  })

  it('requests post resources', function(done) {
    var client = desk.createClient({
      subdomain: config.subdomain,
      username: config.username,
      password: config.password,
      logger: { trace: function() {} }
    });

    var params = {
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
      should.not.exist(err);
      try {
        json.should.have.property('_links');
        json._links.should.have.property('self');
        json._links.self.should.have.property('href');
        caseUrl = json._links.self.href;
      } catch(err) {
        should.not.exist(err);
      }
      done();
    });
  })

  it('sends a patch request', function(done) {
    var client = desk.createClient({
      subdomain: config.subdomain,
      username: config.username,
      password: config.password
    });

    client.patch(caseUrl, { subject: 'New Subject' }, function(err, json, response) {
      should.not.exist(err);
      json.subject.should.equal('New Subject');
      done();
    });
  })
})