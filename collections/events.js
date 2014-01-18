ItemSchema = new SimpleSchema({
	itemName: {
		type: String,
	},
	itemBringer: {
		type: String,
		optional: true,
	}
}); 


evs = new Meteor.Collection2("events2", {
	schema: {
		evName: {
			type: String,
			label: "Event Name"
		},
		evDesc: {
			type: String,
			label: "Event Description",
			optional: true
		},
		evDate: {
			type: Date,
			label: "Date"
		},
		evTime: {
			type: String,
			label: "Time"
		},
		evLoc: {
			type: String,
			label: "Location"
		},
		evOwner: {
			type: String,
			label: "Owner",
			optional: true
		},
		eventItems: {
			type: [ItemSchema],
			label: "Items",
			optional: true
		}
	}
});

evs.allow({
  insert: function(userId, doc){
  	//console.log("Allow insert", userId, doc.evOwner);
  	//Only allow an owner to insert a new event
    return (userId && doc.evOwner === userId);
  },
  update: function(userId, doc, fields, modifier){
  	//console.log("Allow update", userId, doc.evOwner, fields, modifier, (userId && doc.evOwner === userId));
  	
  	//Client can never update evOwner
  	if (fields.toString() == 'evOwner') {
  		return false;
  	}
  	//Allow anyone logged in to update the items
  	if (fields.toString() == 'eventItems') {
  		return (userId && userId);
  	} else {
  	//Only allow owner to update the rest of the fields
    	return (userId && doc.evOwner === userId);
	}
  },
  remove: function(userId, doc){
  	//Only allow owner to remove an event
    return (userId && doc.evOwner === userId);
  }
});

