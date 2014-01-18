Template.eventList.helpers({
	events: function(){
		return evs.find();
	}
});

Template.eventList.events({
	'click #signin': function(e, t) {
		signInWithCallback(function(){return Router.go('eventList')});
	}
});