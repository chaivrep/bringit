Template.home.helpers({
    
    'events2Collection': function(){
        return eForm;
    },
});

timeOptionsArray = function(){
        var a = new Date(0,0,0,0,0,0,0);
        var b = new Date(0,0,0,0,30,0,0);

        r = new Array();
        for (i =0; i < ops.length; i++){
            r[i] = {label: ops[i].format("hh:mm A"), value: ops[i].format("hh:mm A")};
        }
        return r;
};

signInWithCallback = function(fn, params){
    if ( Meteor.userId()) {
        console.log('User already logged in');
        return fn(params); 
    }
    console.log('User not logged in');
    Meteor.loginWithFacebook({}, function(err){
        if (err){
            console.log(err);
            return false;
        } else {
            console.log('Login success');
            Meteor.flush();
            return fn(params);
        }
    });
};

Meteor.startup(function(){ 

    //Set up array of times
    ops = new Array(); 
    for (i=0; i < 48; i++){
        m = new moment("12:00 AM", "hh:mm A");
        ops[i] = m.add('minutes', 30*i);
    }
    
    eForm.hooks({
    /*before: {
        insert: function(doc) {},
        update: function(modifier) {},
        remove: function(docId) {},
        "methodName": function(doc) {}
    },
    after: {
        insert: function(error, result, template) {},
        update: function(error, template) {},
        remove: function(error, template) {},
        "methodName": function(error, result, template) {}
    },*/
    onSubmit: function(insertDoc, updateDoc, currentDoc) {

           console.log("onSubmit:", insertDoc, updateDoc, currentDoc); 
            
           if ( Meteor.userId() ){
                console.log('User already logged in');
                createEvent(insertDoc);

                //Return false to prevent standard insert
                return false;
            } else {   
                console.log('User not logged in');
                Meteor.loginWithFacebook({}, function(err){
                    if (err){
                        console.log('Facebook login fail', err);
                        //Return false to prevent standard insert
                        return false;
                    } else {
                        if (Meteor.userId()){
                            console.log('Login success');
                            createEvent(insertDoc);
                            //Return false to prevent standard insert
                           return false;
                        }
                    }
                });
            }
            //Return false to prevent standard insert
            return false;
    },
        //formToDoc: function(doc) {},
        //docToForm: function(doc) {}
    });
});

createEvent = function(doc){
    console.log("createEvent");
    doc.evOwner = Meteor.userId();
    doc.evDesc = "";
    doc.items = new Array();
    evs.insert(doc, function(err, id){
        if (id){
            console.log('Successful insertion of event', id);

            evs.update(id, {$addToSet: {eventItems: {itemName: 'Sample Item', itemBringer: ""}}}, function(error, result){
                if (error){
                    console.log("addItems error:", error);
                }
            });
            Router.go('eventShow', {_id: id});
            return doc;
        } else {
            console.log('Error inserting event', err);
            return doc;
        }
    });
};

Handlebars.registerHelper('user_name', function (u) {
    if (u){
        usr = Meteor.users.findOne(u);
        if (usr){   
            return usr.profile.name;
        }
    }
});

Handlebars.registerHelper('user_image', function (u) {
    if (u) {
        usr = Meteor.users.findOne(u);
        if (usr){
            return "http://graph.facebook.com/" + usr.services.facebook.id + "/picture/?width=200&height=200";
        }
    }
});

Handlebars.registerHelper('formatDate', function(d) {
    return moment(d).format('L');
});


Handlebars.registerHelper('currURL', function() {
    return window.location.href;
});

Handlebars.registerHelper('timeOptions', function() {
    return timeOptionsArray();
});


//FIX FOR FOUNDATION TO FORCE LOAD OF JS AFTER PAGE LOAD
Template.template.rendered = function(){
    console.log("template rendered");
    $(document).foundation();
}


//SUBSCRIPTIONS
evsOneHandle = null;
evsListHandle = null;

Deps.autorun(function() {
    console.log("Autosub evs", Session.get("eventId"));
    evsOneHandle = Meteor.subscribe("evs", Session.get("eventId"));
    evsListHandle = Meteor.subscribe("evsList");
});


//SOCIAL URLS
Handlebars.registerHelper('twitterUrl', function() {
    return "http://www.twitter.com/peterchaivre";
});

Handlebars.registerHelper('linkedinUrl', function() {
    return "http://www.linkedin.com/in/peterchaivre";
});

Handlebars.registerHelper('blogUrl', function() {
    return "http://www.peterchaivre.com";
});

Handlebars.registerHelper('bugUrl', function() {
    return "https://github.com/chaivrep/bringit/issues/new";
});


