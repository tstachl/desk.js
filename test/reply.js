
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
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
describe('Reply', function() {
  describe('sub resource hack', function() {
    it('declares sub resources as page', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        cases[0].replies(function(err, replies) {
          replies.should.be.an.instanceof(require('../lib/resource/page'));
          done();
        });
      });
    })
  })

  describe('create', function() {
    it('creates a new reply on a case', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        // cases[0] is a phone call
        cases[0].replies().create({
          body: 'some text for this reply',
          direction: 'out',
          status: 'sent'
        }, function(err, reply) {
          reply.getBody().should.equal('some text for this reply');
          reply.getDirection().should.equal('out');
          done();
        });
      });
    })
  })

  describe('update', function() {
    it('updates replies on cases', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        // cases[0] is a phone call
        cases[1].replies().create({
          body: 'some text for this reply',
          direction: 'out',
          status: 'draft'
        }, function(err, reply) {
          reply.setBody('some other text for this reply');
          reply.update(function(err, reply) {
            reply.getBody().should.equal('some other text for this reply');
            reply.getDirection().should.equal('out');
            done();
          });
        });
      });
    })
  })
})