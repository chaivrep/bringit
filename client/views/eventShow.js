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
		return moment(d).format('YYYY-MM-DD');
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
			if (itemNameVal) {
				params = new Array(this._id, itemNameVal, this.evOwner);
				signInWithCallback(addItem, params);
			}
		}
	},
	'focusout #add_itemName': function (e, t){
		var itemNameVal = String(e.target.value || "");
		if (itemNameVal) {
			params = new Array(this._id, itemNameVal, this.evOwner);
			signInWithCallback(addItem, params);
		}
		Session.set('add_Item', false);
	},
	'click .deleteItem': function(e,t){
  		var name = $(e.target).data("id");
  		//console.log("Opening confirm for ", name);
  		$("div[data-id = '" + name + "']").foundation('reveal', 'open');
  	},
  	'click .deleteEvent': function(e,t){
  		var name = $(e.target).data("id");
  		//console.log("Opening confirm for ", name);
  		$('.deleteEventModal').foundation('reveal', 'open');
  	},
	'click .bringit': function(e,t){
  		//add user as Bringer
  		name = e.target.id;
  		params = new Array(name);

  		signInWithCallback(updateBringer, params);e
  		
  	},
  	'click .unbringit': function(e,t){
  		//remove user as Bringer
  		name = e.target.id;
  		params = new Array(name, null);
  		updateBringer(params);
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
	Session.set(cookie, false);
};


//params[0] is item; params[1] is bringer's id (optional)
function updateBringer(params){
	
	var l = evs.findOne(Session.get('eventId'));

	//If user not passed in, assume bringer is current user
	if (params.length == 1){
		params[1] = Meteor.userId();
		//console.log("params", params);
	}
	if (l && l.eventItems) {
		for (var i = 0; i < l.eventItems.length; i++) {
			if (l.eventItems[i].itemName === params[0]) {
				l.eventItems[i].itemBringer = params[1];
			}
		}
		evs.update(l._id, {$set: {"eventItems": l.eventItems}});
	}
};


function addItem(params){
	bringer = null;
	//If someone other than the event owner adds an item, automatically mark them as bringing it
	//console.log('params[2]:', params[2], " uId:", Meteor.userId());
	if (params[2] != Meteor.userId()) {
		bringer = Meteor.userId();
	} 
	//console.log('addItem:', params[0], params[1], bringer);
	evs.update(params[0], {$addToSet: {eventItems: {itemName: params[1], itemBringer: bringer}}}, function(error, result){
		if (error){
			console.log("addItems error:", error);
		}

	});
	Session.set('add_Item', false);
	Deps.flush();
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
