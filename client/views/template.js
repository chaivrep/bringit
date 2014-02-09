//FIX FOR FOUNDATION TO FORCE LOAD OF JS AFTER PAGE LOAD
Template.template.rendered = function(){
    $(document).foundation();
}

Template.template.helpers({
	analyticsPage: function(){
		return analytics.page(Session.get('page'));
	},
});