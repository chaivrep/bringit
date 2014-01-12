Meteor.publish('evsOne', function(i) {
	this.ready();
  	return evs.find({_id: i});
});

Meteor.publish('evsList', function() {
	this.ready();
  	return evs.find({}, {fields: {eventItems: 0, evDesc: 0, evLoc: 0}, sort: {evName: 1}});
});

Meteor.publish('users', function() {
	this.ready();
	return Meteor.users.find({}, {fields: {'services.facebook.id' : 1, 'profile.name': 1 }});
});

