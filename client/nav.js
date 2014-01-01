Template.nav.events({
	'click #login': function (e, t) {
		sign_in();
	},
});

Template.nav.helpers({
	'active': function(page){
		if (page == Session.get('page')){
			return 'active';
		}
	}
});


