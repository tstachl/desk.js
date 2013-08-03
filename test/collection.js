var desk = require('../')
  , should = require('should')
  , config = require('config')
  , replay = require('replay')
  , util = require('util');

replay.fixtures = __dirname + '/fixtures'

function createClient() {
  return desk.createClient({
    subdomain: config.subdomain,
    username: config.username,
    password: config.password
  })
}

describe('Collection', function() {
  it('injects itself into client', function(done) {
    var client = createClient();
    client.users.should.be.a('function');
    done();
  })

  it('returns the client', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      users.getClient().isClient.should.be.ok;
      done();
    })
  })

  it('fetchs a resultset', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      should.not.exist(err);
      users.should.be.an.instanceof(Array);
      done();
    })
  })

  it('paginates results', function(done) {
    var client = createClient();
    client.users().perPage(1).page(1).exec(function(err, users) {
      should.not.exist(err);
      users.length.should.equal(1);
      users.pagination.per_page.should.equal(1);
      users.pagination.page.should.equal(1);
      done();
    });
  })

  it('uses links for next|previous|first|last', function(done) {
    var client = createClient();
    client.users().perPage(1).page(1).exec(function(err, users) {
      should.not.exist(err);
      users.last(function(err, users) {
        should.not.exist(err);
        users.first(function(err, users) {
          should.not.exist(err);
          users.next(function(err, users) {
            should.not.exist(err);
            users.previous(function(err, users) {
              should.not.exist(err);
              users.length.should.equal(1);
              users.pagination.per_page.should.equal(1);
              users.pagination.page.should.equal(1);
              done();
            });
          });
        });
      });
    });
  })

  it('can not go beyond the last page', function(done) {
    var client = createClient();
    client.users().perPage(1).page(1).exec(function(err, users) {
      should.not.exist(err);
      users.last(function(err, users) {
        should.not.exist(err);
        users.next(function(err, users) {
          should.not.exist(err);
          should.not.exist(users);
          done();
        });
      });
    });
  })

  it('can not go before the first page', function(done) {
    var client = createClient();
    client.users().perPage(1).page(1).exec(function(err, users) {
      should.not.exist(err);
      users.previous(function(err, users) {
        should.not.exist(err);
        should.not.exist(users);
        done();
      });
    });
  })
})