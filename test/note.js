
var desk = require('../')
  , should = require('should')
  , replay = require('replay')
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
describe('Note', function() {
  describe('create', function() {
    it('creates a new note on a case', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        // cases[0] is a phone call
        cases[0].notes().create({
          body: 'some text for this note'
        }, function(err, note) {
          note.getBody().should.equal('some text for this note');
          done();
        });
      });
    })
  })

  describe('update', function() {
    it.skip('updates notes on cases - not supported by desk.com API (yet)', function(done) {
      var client = createClient();
      client.cases(function(err, cases) {
        // cases[0] is a phone call
        cases[0].notes(function(err, notes) {
          notes[0].setBody('some other text for this note');
          notes[0].update(function(err, note) {
            note.getBody().should.equal('some other text for this note');
            done();
          })
        });
      });
    })
  })
})