Meteor.publish('evsOne', function(i) {
  	return evs.find({_id: i});
});

Meteor.publish('evsList', function(i) {
  	return evs.find({});
});

Meteor.publish('users', function() {
	return Meteor.users.find({}, {fields: {'services.facebook.id' : 1, 'profile.name': 1 }});
});