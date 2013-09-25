
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , articleHref
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
describe('Article', function() {
  describe('create', function() {
    it('creates a new article', function(done) {
      var client = createClient();
      client.articles().create({
        subject: 'Some Subject',
        body: 'Some Body',
        _links: {
          topic: {
            href: '/api/v2/topics/498301',
            'class': 'topic'
          }
        }
      }, function(err, article) {
        article.getSubject().should.equal('Some Subject');
        article.getBody().should.equal('Some Body');
        articleHref = article.definition._links.self.href;
        done();
      });
    })
  })

  describe('update', function() {
    it('updates an article', function(done) {
      var client = createClient();
      client.articles().byUrl(articleHref, function(err, article) {
        article.update({ subject: 'Some other Subject' }, function(err, article) {
          article.getSubject().should.equal('Some other Subject');
          done();
        });
      });
    })
  })

  describe('delete', function() {
    it('deletes an article', function(done) {
      var client = createClient();
      client.articles().byUrl(articleHref, function(err, article) {
        article.destroy(function(err) {
          should.not.exist(err);
          done();
        });
      });
    })
  })
})