Template.nav.events({
	'click #login': function (e, t) {
		signIn();
	},
});

Template.nav.helpers({
	'active': function(page){
		if (page == Session.get('page')){
			return 'active';
		}
	}
});