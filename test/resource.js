var desk = require('../')
  , should = require('should')
  , replay = require('replay')
  , util = require('util')
  , Resource = require('../lib/resource')
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

describe('Resource', function() {
  it('injects itself into client', function() {
    var client = createClient();
    client.users.should.be.a('function');
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
      users.perPage().should.equal(1);
      users.page().should.equal(1);
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
              users.perPage().should.equal(1);
              users.page().should.equal(1);
              done();
            });
          });
        });
      });
    });
  })

  it('does not keep all the records on the original resource', function(done) {
    var client = createClient();
    client.cases(function(err, cases) {
      should.not.exist(err);
      cases.length.should.equal(50);
      cases.next(function(err, cases) {
        should.not.exist(err);
        cases.length.should.equal(50);
        client.cases(function(err, cases) {
          should.not.exist(err);
          cases.length.should.equal(50);
          done();
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

  it('can fetch subresources', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      should.not.exist(err);
      users[0].should.be.an.instanceof(Resource);
      users[0].preferences(function(err, preferences) {
        should.not.exist(err);
        preferences.should.be.an.instanceof(Resource);
        done();
      });
    });
  })

  it('creates a getter and a setter for its fields', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      should.not.exist(err);
      users.getTotalEntries.should.be.a('function');
      users.setTotalEntries.should.be.a('function');
      users[0].getPublicName.should.be.a('function');
      users[0].setPublicName.should.be.a('function');
      done();
    });
  })

  it('uses the getter function to return total entries', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      users.getTotalEntries().should.equal(5);
      done();
    })
  })

  it('uses the setter function to set a new value', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      users.setTotalEntries(10);
      users._changed.total_entries.should.equal(10);
      done();
    })
  })

  it('respects resources without links', function(done) {
    var client = createClient();
    client.systemMessage(function(err, systemMessage) {
      should.not.exist(err);
      systemMessage.should.be.an.instanceof(Resource);
      done();
    });
  })

  it('allows searches for searchable resources', function(done) {
    var client = createClient();
    client.articles().search({ text: 'asdf' }, function(err, articles) {
      articles.length.should.be.equal(30);
      done();
    });
  })

  it('allows to use a search resource before it is fetched', function(done) {
    var client = createClient();
    client.articles().search({ text: 'asdf' }).exec(function(err, articles) {
      articles.length.should.be.equal(30);
      done();
    });
  })

  it('errors on unsearchable resources', function(done) {
    var client = createClient();
    client.users().search({ text: 'asdf' }, function(err, articles) {
      err.should.be.an.instanceof(Error);
      should.not.exist(articles);
      done();
    });
  })

  it('fetches a resource by url', function(done) {
    var client = createClient();
    client.users().byUrl('/api/v2/users/16096734', function(err, user) {
      should.not.exist(err);
      user.getPublicName().should.equal('Thomas Stachl');
      done();
    });
  })

  it('fetches a resource by id', function(done) {
    var client = createClient();
    client.users().byId(16096734, function(err, user) {
      should.not.exist(err);
      user.getPublicName().should.equal('Thomas Stachl');
      done();
    });
  })

  it('can not create a resource that does not support create', function(done) {
    var client = createClient();
    client.users(function(err, users) {
      users.create({ name: 'Test', role: 'something' }, function(err, user) {
        err.message.should.equal('User doesn\'t support creating new resources.');
        should.not.exist(user);
        done();
      })
    })
  })

  it('can not update a resource that does not support update', function(done) {
    var client = createClient();
    client.cases(function(err, cases) {
      // cases[0] is a phone call
      cases[0].notes(function(err, notes) {
        should.not.exist(notes[0].update);
        done();
      });
    });
  })
})