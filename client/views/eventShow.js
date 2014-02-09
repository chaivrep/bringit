Template.eventShow.rendered = function(){
	thisBitly = getShortUrl();
};

Template.eventShow.helpers({
	selected: function(time, value){
		if (time == value) {
			return "selected=selected";
		} else {
			return "";
		}
	},
	formatTime: function(t){
		return moment(t, "HH:mm A").format('LT');
	},
	formatDateInput: function(d){
		return moment(d).format('MM/DD/YYYY');
	},
	eventDescExists: function(){
		return ((this.evDesc != "") || (this.evOwner == Meteor.userId()));
	},
	is_bringing: function(bringer){
		if (bringer == Meteor.userId()){
			return "You are bringing...";
		} else {
			return userName(bringer) + " is bringing...";
		}
	},
	userIsOwner: function(){	
		return ((this.evOwner != null) && (Meteor.userId() == this.evOwner));
	},
	isOwner: function(){
		u = evs.findOne(Session.get('eventId')).evOwner;
		//console.log('owner', u);
		if (u) {
			return (u == Meteor.userId());
		} else {
			return false;
		}
	},
	userIsBringer: function(bringer){
		return (bringer == Meteor.userId());
	},
	edit_eventName: function(){
		return Session.get('edit_eventName');
	},
	
	edit_eventDate: function(){
		return Session.get('edit_eventDate');
	},
	edit_eventTime: function(){
		return Session.get('edit_eventTime');
	},
	edit_eventLocation: function(){
		return Session.get('edit_eventLocation');
	},
	add_Item: function() {
		return Session.get('add_Item');
	},
});

Template.eventShow.events({
	'click .sendInvite': function(e,t){
  		$("#inviteModal").foundation('reveal', 'open');
  	},
	'mouseover #nameDiv': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#nameDiv").addClass("highlight");
		}
	},
	'mouseout #nameDiv': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#nameDiv").removeClass("highlight");
		}
	},
	'click #eventName': function (e, t) {
		if (Meteor.userId() == this.evOwner) {
			Session.set('edit_eventName', true);
			Meteor.flush();
			$("#edit_eventName").focus();
		}
	},
	'keyup #edit_eventName': function (e, t) {
		if (e.which === 13) {
			updateEventAttr(this._id, 'evName', e.target.value, 'edit_eventName', true);
		}
	},
	'focusout #edit_eventName': function (e, t){
		updateEventAttr(this._id, 'evName', e.target.value, 'edit_eventName', true);
	},
	'click #eventDesc': function (e, t) {
		if (Meteor.userId() == this.evOwner) {
			Session.set('edit_eventDesc', true);
			Meteor.flush();
			$("#edit_eventDesc").focus();
		}
	},
	'keyup #edit_eventDesc': function (e, t) {
		if (e.which === 13) {
			updateEventAttr(this._id, 'evDesc', e.target.value, 'edit_eventDesc', false);
	  	}
	},
	'focusout #edit_eventDesc': function (e, t){
		updateEventAttr(this._id, 'evDesc', e.target.value, 'edit_eventDesc', false);
	},
	'mouseover #descDiv': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#descDiv").addClass("highlight");
		}
	},
	'mouseout #descDiv': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#descDiv").removeClass("highlight");
		}
	},
	'mouseover #eventDate': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#eventDate").addClass("highlight");
		}
	},
	'mouseout #eventDate': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#eventDate").removeClass("highlight");
		}
	},
	'click #eventDate': function (e, t) {
		if (Meteor.userId() == this.evOwner) {
			Session.set('edit_eventDate', true);
			Deps.flush();
			$("#edit_eventDate").focus();
		}
	},
	'keyup #edit_eventDate': function (e, t) {
		if (e.which === 13) {
			updateEventAttr(this._id, 'evDate', moment(e.target.value).toDate(), 'edit_eventDate', true);
		}
	},
	'blur #edit_eventDate': function (e, t) {
		updateEventAttr(this._id, 'evDate', moment(e.target.value).toDate(), 'edit_eventDate', true);
	},
	'focusout #edit_eventDate': function (e, t){
		Session.set('edit_eventDate', false);
	},
	'mouseover #eventTime': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#eventTime").addClass("highlight");
		}
	},
	'mouseout #eventTime': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#eventTime").removeClass("highlight");
		}
	},
	'click #eventTime': function (e, t) {
		if (Meteor.userId() == this.evOwner) {
			Session.set('edit_eventTime', true);
			Deps.flush();
			$("#edit_eventTime").val(this.evTime);
			$("#edit_eventTime").focus();
		}
	},
	'change #edit_eventTime': function (e, t) {
		var timeVal = String(e.target.value || "");
		if (timeVal) {
			evs.update(this._id, {$set:{evTime: timeVal}});
			Session.set('edit_eventTime', false);
		}
	},
	'focusout #edit_eventTime': function (e, t){
		Session.set('edit_eventTime', false);
	},
	'mouseover #eventLocation': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#eventLocation").addClass("highlight");
		}
	},
	'mouseout #eventLocation': function(e,t){
		if (Meteor.userId() == this.evOwner) {
			$("#eventLocation").removeClass("highlight");
		}
	},
	'click #eventLocation': function (e, t) {
		if (Meteor.userId() == this.evOwner) {
			Session.set('edit_eventLocation', true);
			Meteor.flush();
			$("#edit_eventLocation").focus();
		}
	},
	'keypress #edit_eventLocation': function (e, t) {
		if (e.which === 13) {
			updateEventAttr(this._id, 'evLoc', e.target.value, 'edit_eventLocation', true);
		}
	},
	'focusout #edit_eventLocation': function (e, t){
		updateEventAttr(this._id, 'evLoc', e.target.value, 'edit_eventLocation', true);
	},
	'click #addItemPanel': function (e, t) {
		Session.set('add_Item', true);
		Meteor.flush();
		$("#add_itemName").focus();
	},
	'keyup #add_itemName': function (e, t) {
		if (e.which === 13) {
			var itemNameVal = String(e.target.value || "");
			var id = this._id;
			var owner = this.evOwner;
			if (itemNameVal) {
				signInWithCallback(function(){return addItem(id, itemNameVal, owner)});
			}
		}
	},
	'focusout #add_itemName': function (e, t){
		var itemNameVal = String(e.target.value || "");
		var id = this._id;
		var owner = this.evOwner;
		if (itemNameVal) {
			signInWithCallback(function(){return addItem(id, itemNameVal, owner)});
		}
		Session.set('add_Item', false);
	},
	'click .deleteItem': function(e,t){
  		var name = $(e.target).data("id");
  		//console.log("Opening confirm for ", name);
  		$("div[data-id = '" + name + "']").foundation('reveal', 'open');
  		//Tracking: Show delete item modal
    	analytics.track('Delete item: Show modal');
  	},
  	'click .deleteEvent': function(e,t){
  		var name = $(e.target).data("id");
  		//console.log("Opening confirm for ", name);
  		$('.deleteEventModal').foundation('reveal', 'open');
  		//Tracking: Show delete event modal
    	analytics.track('Delete event: Show modal');
  	},
	'click .bringit': function(e,t){
  		//add user as Bringer
  		name = e.target.id;
  		signInWithCallback(function(){return updateBringer(name)});
  		//Tracking: Bring It!
    	analytics.track('Bring item: Bring');
  		
  	},
  	'click .unbringit': function(e,t){
  		//remove user as Bringer
  		name = e.target.id;
  		updateBringer(name, "");
  		//Tracking: un-bring It!
    	analytics.track('Bring item: Un-bring');
  	},
  	'click input.bitly': function(e,t){
  		$('.bitly').select();
  	},
  	'focusout .bitly': function(e,t){
  		$('.bitly').val(getShortUrl());
  	},
  });


function updateEventAttr(id, attr, val, cookie, blankForbid) {
	var obj = {};
	obj[attr] = val;
	if ((val != "") || !blankForbid) {
		evs.update(id, {$set: obj});
	}
	//Tracking: Update event - Event owner is updating something about the event
    analytics.track('Update event', {attribute: attr});
	Session.set(cookie, false);
};


function updateBringer(itemName, userId){
	
	var l = evs.findOne(Session.get('eventId'));

	//If user not passed in, assume bringer is current user
	if (userId == null){
		userId = Meteor.userId();
		//console.log("params", params);
	}
	if (l && l.eventItems) {
		for (var i = 0; i < l.eventItems.length; i++) {
			if (l.eventItems[i].itemName === itemName) {
				l.eventItems[i].itemBringer = userId;
			}
		}
		evs.update(l._id, {$set: {"eventItems": l.eventItems}});
	}
};


function addItem(eventId, itemName, eventOwner){
	//console.log("Add item: ", eventId, itemName, eventOwner);
	bringer = null;
	//If someone other than the event owner adds an item, automatically mark them as bringing it
	if (eventOwner != Meteor.userId()) {
		bringer = Meteor.userId();
		//Tracking: Add item - SOmeone other than the event owner is adding the item
        analytics.track('Add Item: Not event owner');
	} else {
		//Tracking: Add item - Event owner is adding the item
        analytics.track('Add Item: Event owner');
	}
	evs.update(eventId, {$addToSet: {eventItems: {itemName: itemName, itemBringer: bringer}}}, function(error, result){
		if (error){
			console.log("addItems error:", error);
		}
	});
	Session.set('add_Item', false);
};


function descriptionPlaceholder(){
	return "Click to add a description of your event";
};


/*****************************************************************
 *
 * MODALS & SUB-TEMPLATES
 *
 ****************************************************************/

Template.eventDeleteModal.events({
	'click .confirmDeleteEvent': function(e,t){
  		var name = $(e.target).data("id");
  		//console.log("Delete event delete confirm", name);
  		evs.remove(name);
  		$('.deleteEventModal').foundation('reveal', 'close');
  		//Tracking: Confirm delete event
    	analytics.track('Delete event: Confirm delete');
  		Router.go('eventList');
  	},
	'click .cancelDeleteEvent': function(e,t) {
		//console.log("Delete event close reveal", e);
		$('.deleteEventModal').foundation('reveal', 'close');
		return;
	},
});


Template.itemDeleteModal.events({
	'click .confirmDeleteItem': function(e,t){
  		var name = $(e.target).data("id");
  		//console.log("Delete item delete confirm", name);
  		evs.update(Session.get('eventId'), {$pull: {eventItems: {itemName: name}}});
  		$('.deleteItemModal').foundation('reveal', 'close');
  		//Tracking: Confirm delete item
    	analytics.track('Delete item: Confirm delete');
  		return;
  	},
	'click .cancelDeleteItem': function(e,t) {
		//console.log("Delete item close reveal", e);
		$('.deleteItemModal').foundation('reveal', 'close');
		return;
	},
});


Template.descPanel.helpers({
	edit_eventDesc: function(){
		return Session.get('edit_eventDesc');
	},
	eventDesc: function(){
		//console.log("eventDesc: ", this.evDesc);
		if (this.evDesc == ""){
			return descriptionPlaceholder();
		} else {
			return this.evDesc;
		}
	},
	descPlaceholder: function(){
		return descriptionPlaceholder();
	},
})
