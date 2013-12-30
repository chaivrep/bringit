Template.nav.events({
	'click #login': function (e, t) {
		Meteor.loginWithFacebook();
		Meteor.flush();
		Router.go('/');
	},
});



