//SUBSCRIPTIONS
evsOneHandle = null;
evsListHandle = null;
userHandle = Meteor.subscribe("users");

Deps.autorun(function() {
    //console.log("Autosub evs", Session.get("eventId"));
    evsOneHandle = Meteor.subscribe("evsOne", Session.get("eventId"));
    evsListHandle = Meteor.subscribe("evsList");
});