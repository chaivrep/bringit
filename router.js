if (Meteor.isClient){
  eForm = new AutoForm(evs);
}

Router.configure({
  notFoundTemplate: 'notFound',
});


Router.map(function () {
  
  this.route('home', {
    path: '/',
    layoutTemplate: 'template',
    before: function(){
      Session.set('page', 'home');
    }
  });

  this.route('logout', {
    path: '/user/logout',
    layoutTemplate: 'template',
    template: 'home',
    waitOn: function() {
      Session.set('page', 'home');
      return Meteor.logout();
    },
  });

  this.route('eventList', {
    path: '/user/eventList',
    layoutTemplate: 'template',
    waitOn: function () {
      Session.set('eventId', null);
      Session.set('page', 'eventList');
      return [userHandle, evsListHandle];
    },
    data: function () {
      return evs.find({evOwner: Meteor.userId()});
    },
    loadingTemplate: 'loading'
  });

  this.route('eventShow', {
    path: '/:_id',
    layoutTemplate: 'template',
    waitOn: function () {
      Session.set('eventId', this.params._id);
      Session.set('page', null);
      return [userHandle, evsOneHandle];
    },
    data: function () {
      return evs.findOne(this.params._id);
    },
    loadingTemplate: 'loading'
  });

  
});

