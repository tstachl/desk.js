
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

describe('Job', function() {
  describe('create', function() {
    it.skip('creates a new job - error from desk.com API', function(done) {
      var client = createClient();
      client.jobs().create({
        type: 'bulk_case_update',
        'case': {
          status: 'pending'
        },
        case_ids: [3030, 3031]
      }, function(err, job) {
        job.getType().should.equal('bulk_case_update');
        done();
      });
    })
  })
})