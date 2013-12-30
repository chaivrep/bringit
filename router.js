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
  });

  this.route('logout', {
    path: '/user/logout',
    layoutTemplate: 'template',
    template: 'home',
    waitOn: function() {
      return Meteor.logout();
    },
  });

  this.route('eventList', {
    path: '/user/eventList',
    layoutTemplate: 'template',
    waitOn: function () {
      Session.set('eventId', null);
      return [evsListHandle, Meteor.subscribe('users')];
    },
    data: function () {
      return evs.find({evOwner: Meteor.userId()}, {fields: {eventItems: 0, evDesc: 0, evLoc: 0}, sort: {evName: 1}});
    },
  });

  this.route('eventShow', {
    path: '/:_id',
    layoutTemplate: 'template',
    waitOn: function () {
      console.log('ID:', this.params._id);
      Session.set('eventId', this.params._id);
      //return [Meteor.subscribe('evsOne', this.params._id), Meteor.subscribe('users')];
      return [evsOneHandle, Meteor.subscribe('users')];
    },
    data: function () {
      return evs.findOne(this.params._id);
    },
  });

  
});

