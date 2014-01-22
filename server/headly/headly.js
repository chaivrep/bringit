Meteor.headly.config({tagsForRequest: function(req) {

		currLoc = req.headers.host + req.url;
		
		id = req.url.replace('/', '');
        var ev = evs.findOne({_id: id});
        var content = "Bring It!";
        var description = "Bring It! allows you to easily create and manage the list of items you want guests to bring to your next party."

        if (ev){
        	content = ev.evName;
        }

        return '<meta property="og:title" content="'+content+'"/>\n'
		+ '<meta property="og:type" content="website"/>\n'
		+ '<meta property="og:image" content="http://www.bringitapp.net/images/BringIt_Thumb.jpg"/>\n'
		+ '<meta property="og:url" content="http://' + currLoc + '"/>\n'
		+ '<meta property="og:description" content="Bring It! allows you to easily create and manage the list of items you want guests to bring to your next party."/>\n'
		+ '<meta property="fb:admins" content="1249063254"/>\n';
	}
});