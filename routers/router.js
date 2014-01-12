/*****************************
 *
 * Create an autoform for the homepage to create Events. 
 *
 ****************************/
if (Meteor.isClient){
  eForm = new AutoForm(evs);
}

/*****************************
 *
 * Configuration for iron-router.
 * Session('page', XXXXX) tells Nav which element should be active  
 *
 ****************************/

Router.configure({
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  layoutTemplate: 'template',
});

Router.map(function () {
  
  this.route('home', {
    path: '/',
    before: function(){
      Session.set('page', 'home');
      //return userHandle;
    },
  });

  this.route('logout', {
    path: '/user/logout',
    template: 'home',
    waitOn: function() {
      Session.set('page', 'home');
      return Meteor.logout();
    },
  });

  this.route('eventList', {
    path: '/user/eventList',
    waitOn: function () {
      Session.set('eventId', null);
      Session.set('page', 'eventList');
      return [userHandle, evsListHandle];
    },
    data: function () {
      return evs.find({evOwner: Meteor.userId()});
    },
  });

  this.route('eventShow', {
    path: '/:_id',
    waitOn: function () {
      Session.set('eventId', this.params._id);
      Session.set('page', null);
      return [userHandle, evsOneHandle];
    },
    data: function () {
      return evs.findOne(this.params._id);
    },
  });
});
