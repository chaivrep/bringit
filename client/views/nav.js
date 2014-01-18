Template.nav.events({
	'click #login': function (e, t) {
		signInWithCallback(function(){Router.go('eventList')});
	},
});

Template.nav.helpers({
	'active': function(page){
		if (page == Session.get('page')){
			return 'active';
		}
	}
});