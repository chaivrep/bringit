//LAIKA TESTS

var assert = require('assert');



/***********************************************
 *
 * Test for ensuring schema is enforcing fields and types
 *
 **********************************************/

suite('Events', function() {
  test('insert on server and retrieve all values', function(done, server, client) {
    server.eval(function() {
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "123abc", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
      var docs = evs.find().fetch();
      emit('docs', docs);
      var ev = evs.findOne();
      emit('event', ev);
    });

    server.on('docs', function(docs) {
      assert.equal(docs.length, 1);
    }).on('event', function(ev) {
      assert.equal(ev.evName, "hello title");
    }).on('event', function(ev) {
      assert.equal(ev.evTime, "12:30 PM");
    }).on('event', function(ev) {
      assert.equal(ev.evLoc, "There");
    }).on('event', function(ev) {
      assert.equal(ev.evDesc, "Description");
    }).on('event', function(ev) {
      assert.equal(ev.evDate, "2014-01-31T00:00:00.000Z");
    }).on('event', function(ev) {
      assert.equal(ev.evOwner, "123abc");
    }).on('event', function(ev) {
      assert.equal(ev.eventItems[0].itemName, "Item");
    }).on('event', function(ev) {
      assert.equal(ev.eventItems[0].itemBringer, "bringer");
      done();
    });
  });
});


/***********************************************
 *
 * Test for ensuring proper permissions are met
 * for database queries.  Uses client database calls.
 *
 **********************************************/

suite('User Authorization', function() {
  test('insert event access granted for loggedin users', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      emit('done');
    }).once('done', function() {
      server.eval(observeCollection);
    });

    function observeCollection() {
      evs.find().observe({
        added: function(doc) {
          emit('added', doc);
        }
      });
    }

    server.on('added', function(ev) {
      assert.equal(ev.evName, "hello title");
    }).on('added', function(ev) {
      assert.equal(ev.evTime, "12:30 PM");
    }).on('added', function(ev) {
      assert.equal(ev.evLoc, "There");
    }).on('added', function(ev) {
      assert.equal(ev.evDesc, "Description");
    }).on('added', function(ev) {
      assert.equal(ev.evDate, "2014-01-31T00:00:00.000Z");
    }).on('added', function(ev) {
      assert.notEqual(ev.evOwner, null);
    }).on('added', function(ev) {
      assert.notEqual(ev.evOwner, "");
    }).on('added', function(ev) {
      assert.equal(ev.eventItems.toString(), new Array().toString());
      done();
    });

    client.eval(function() {
      Meteor.loginWithPassword('a@a.com', '123456', function() {
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: Meteor.userId(), evDesc: "Description", eventItems: new Array()});
      });
    });
  });

  test('insert event access denied for non-loggedin users', function(done, server, client) {
    client.eval(function() {
      evs.find().observe({
        removed: function(doc) {
          emit('removed', doc);
        }
      });

      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: 'someone-else', evDesc: "Description", eventItems: new Array()});
    });

    client.on('removed', function(ev) {
      assert.equal(ev.evName, "hello title");
    }).on('removed', function(ev) {
      assert.equal(ev.evTime, "12:30 PM");
    }).on('removed', function(ev) {
      assert.equal(ev.evLoc, "There");
    }).on('removed', function(ev) {
      assert.equal(ev.evDate, "2014-01-31T00:00:00.000Z");
      done();
    });
  });

  test('delete event access granted for owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: Meteor.users.findOne()._id, evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
      emit('done');
    }).once('done', function() {
      client.eval(observeCollection);
    });

    function observeCollection() {
      evs.find().observe({
        removed: function(doc){
          emit('removed', doc);
        },
      });
    }

    client.on('removed', function(ev) {
      assert.equal(ev.evName, "hello title");
      done();
    });

    client.eval(function() {
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.remove(evs.findOne()._id);
      });
    });
  });

  test('delete event access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
      emit('done');
    });

    client.on('remove', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() {
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.remove(evs.findOne()._id, function(err){
          emit('remove', err);
        });
      });
    });
  });

  test('update event access denied for non-loggedin users', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function(){
      Meteor.loginWithPassword('a@a.com', '123456', function(error) {
        if (!error){
          evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: Meteor.userId(), evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
          Meteor.logout(function(error){
            if (!error){
              evs.update(evs.findOne()._id, {$addToSet: {eventItems: {itemName: 'New item', itemBringer: 'New bringer'}}}, function(err, result){
                emit('update', err);
              });
            }
          });
        }
      });
    });
  });

  test('update evName access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.update(evs.findOne()._id, {$set: {evName: 'New name'}}, function(err, result){
          emit('update', err);
        });
      });
    });
  });

  test('update evDate access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.update(evs.findOne()._id, {$set: {evDate: new Date("9999-01-31T00:00:00.000Z")}}, function(err, result){
          emit('update', err);
        });
      });
    });
  });

  test('update evTime access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.update(evs.findOne()._id, {$set: {evTime: "4:00 PM"}}, function(err, result){
          emit('update', err);
        });
      });
    });
  });

  test('update evLoc access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.update(evs.findOne()._id, {$set: {evLoc: "New loc"}}, function(err, result){
          emit('update', err);
        });
      });
    });
  });

  test('update evOwner access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.update(evs.findOne()._id, {$set: {evOwner: "New owner"}}, function(err, result){
          emit('update', err);
        });
      });
    });
  });

  test('update evOwner access denied for owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function(error) {
        if (!error){
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: Meteor.userId(), evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
          evs.update(evs.findOne()._id, {$set: {evOwner: "New owner"}}, function(err, result){
              emit('update', err);
          });
        }
      });
    });
  });

  test('update evDesc access denied for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array({itemName: "Item", itemBringer: "bringer"})});
    });

    client.on('update', function(err) {
      assert.equal(err.error, "403"); //403 is Access Denied error
      done();
    });

    client.eval(function() { 
      Meteor.loginWithPassword('a@a.com', '123456', function() {
        evs.update(evs.findOne()._id, {$set: {evDesc: "New desc"}}, function(err, result){
          emit('update', err);
        });
      });
    });
  });

  test('update eventItems access granted for non-owners', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array()});
      emit('done');
    }).once('done', function() {
      client.eval(observeCollection);
    });

    function observeCollection() {
      evs.find().observe({
        changed: function(doc){
          emit('update', doc);
        },
      });
    }

    client.on('update', function(result) {
      assert.equal(result.eventItems[0].itemName, "New item");
    }).on('update', function(result) {
      assert.equal(result.eventItems[0].itemBringer, "New bringer");
      done();
    });

    client.eval(function() {
        Meteor.loginWithPassword('a@a.com', '123456', function() {
          evs.update(evs.findOne()._id, {$addToSet: {eventItems: {itemName: 'New item', itemBringer: 'New bringer'}}});
        });
    });
  });

test('update event access granted for owners (except evOwner)', function(done, server, client) {
    server.eval(function() {
      Accounts.createUser({email: 'a@a.com', password: '123456'});
      evs.insert({evName: "hello title", evDate: new Date("2014-01-31T00:00:00.000Z"), evTime: "12:30 PM", evLoc: "There", evOwner: "someone-else", evDesc: "Description", eventItems: new Array()}, function(){
        emit('done');
      });
      
    }).once('done', function() {
      client.eval(observeCollection);
    });

    function observeCollection() {
      evs.find().observe({
        changed: function(doc){
          emit('update', doc);
        },
      });
    }

    client.once('update', function(ev) {
      assert.equal(ev.evName, "new title");
    }).once('update', function(ev) {
      assert.equal(ev.evTime, "4:30 PM");
    }).once('update', function(ev) {
      assert.equal(ev.evLoc, "New loc");
    }).once('update', function(ev) {
      assert.equal(ev.evDesc, "New description");
    }).once('update', function(ev) {
      assert.equal(ev.evDate, "2099-12-31T00:00:00.000Z");
      done();
    });

    client.eval(function() {
        Meteor.loginWithPassword('a@a.com', '123456', function() {
          evs.update(evs.findOne()._id, {$set: {evName: "new title", evDate: new Date(Date.UTC(2099,11,31)), evTime: "4:30 PM", evLoc: "New loc", evDesc: "New description"}});
        });
    });
  });

  /***********************************************
   *
   * Test that app functions properly update the DB
   *
   **********************************************/

});