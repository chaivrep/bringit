/***************************************************
 *
 * HANDLEBARS HELPERS
 *
 **************************************************/

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

Handlebars.registerHelper('user_name', function (u) {
    return userName(u);
});

Handlebars.registerHelper('user_image', function (u) {
    if (u) {
        usr = Meteor.users.findOne(u);
        if (usr && userHandle.ready()){
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


/*******************************************************
 *
 * HELPER FUNCTIONS
 *
 ******************************************************/


signInWithCallback = function(callback){
    if ( Meteor.userId()) {
        //console.log('User already logged in');
        return callback(); 
    }
    //console.log('User not logged in');
    Meteor.loginWithFacebook({}, function(err){
        if (err){
            console.log(err);
            return false;
        } else {
            //console.log('Login success');
            Meteor.flush();
            return callback();
        }
    });
};

createEvent = function(doc){
    //console.log("createEvent");
    doc.evOwner = Meteor.userId();
    doc.evDesc = "";
    doc.eventItems = new Array();

    //Fix local time to be UTC
    doc.evDate.setTime(doc.evDate.getTime() + doc.evDate.getTimezoneOffset()*60000);

    newEvent = evs.insert(doc, function(err, id){
        if (id){
            //console.log('Successful insertion of event', id);
            Router.go('eventShow', {_id: id});
            return doc;
        } else {
            console.log('Error inserting event', err);
            return doc;
        }
    });
};

userName = function(u){
    if (u){
        usr = Meteor.users.findOne(u);
        if (usr){   
            return usr.profile.name;
        }
    }
}

timeOptionsArray = function(){
    var a = new Date(0,0,0,0,0,0,0);
    var b = new Date(0,0,0,0,30,0,0);

    r = new Array();
    for (i =0; i < ops.length; i++){
        r[i] = {label: ops[i].format("hh:mm A"), value: ops[i].format("hh:mm A")};
    }
    return r;
};

getShortUrl = function(){
    currLocation = window.location.href;
    $.getJSON(
        "http://api.bitly.com/v3/shorten?callback=?", 
        { 
            "format": "json",
            "apiKey": "R_2ab87e0da428c047bf68bf4c64bcfad9",
            "login": 'bringitapp',
            "longUrl": currLocation.toString(),
    }, function(response){
        if (response.status_code == "500") {
            result = response.status_txt;
        } else {
            shortUrl = response.data.url;
            result = shortUrl.replace(/.*?:\/\//g, "");
        }
        $(".bitly").val(result);
    });
}