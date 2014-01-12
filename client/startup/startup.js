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

           //console.log("onSubmit:", insertDoc, updateDoc, currentDoc); 
            
           if ( Meteor.userId() ){
                //console.log('User already logged in');
                createEvent(insertDoc);

                //Return false to prevent standard insert
                return false;
            } else {   
                //console.log('User not logged in');
                Meteor.loginWithFacebook({}, function(err){
                    if (err){
                        console.log('Facebook login fail', err);
                        //Return false to prevent standard insert
                        return false;
                    } else {
                        if (Meteor.userId()){
                            //console.log('Login success');
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