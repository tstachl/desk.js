
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , fs = require('fs')
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
describe('Attachment', function() {
  describe('create', function() {
    it('creates a new attachment on a case', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        cases[0].attachments().create({
          file_name: 'GlasKunst.jpg',
          content_type: 'image/jpeg',
          content: fs.readFileSync(__dirname + '/fixtures/attachment.jpg', 'base64')
        }, function(err, attachment) {
          attachment.getFileName().should.equal('GlasKunst.jpg');
          attachment.getUrl().should.not.equal('');
          done();
        });
      });
    })
  })

  describe('delete', function() {
    it('deletes an attachment from a case - currently not working', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        cases[0].attachments(function(err, attachments) {
          attachments[0].destroy(function(err) {
            should.not.exist(err);
            done();
          })
        })
      })
    })
  })

  // describe('update', function() {
  //   it('updates attachments on cases', function(done) {
  //     var client = createClient();
  //     client.cases(function(err, cases) {
  //       // cases[0] is a phone call
  //       cases[1].attachments().create({
  //         body: 'some text for this attachment',
  //         direction: 'out',
  //         status: 'draft'
  //       }, function(err, attachment) {
  //         attachment.setBody('some other text for this attachment');
  //         attachment.update(function(err, attachment) {
  //           attachment.getBody().should.equal('some other text for this attachment');
  //           attachment.getDirection().should.equal('out');
  //           done();
  //         });
  //       });
  //     });
  //   })
  // })
})