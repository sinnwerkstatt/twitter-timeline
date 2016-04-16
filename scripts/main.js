$(function() {

	function formatdate(date) {
		return date.substr(0, 19);
	};


	function linkify(tweet) {
		var out = tweet;
		out = out.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
				return '<a href="'+ url +'">'+ url +'</a>';
		});
		out = out.replace(/[#]+[A-Za-z0-9-_]+/g, function(hash) {
				hash = hash.replace("#", "");
				return '<a href="https://twitter.com/search/%23'+ hash +'">#'+ hash +'</a>';
		});
		out = out.replace(/[@]+[A-Za-z0-9-_]+/g, function(username) {
				var username = username.replace("@","")
				return '<a href="https://twitter.com/'+ username +'">@'+ username +'</a>';
		});
		out = out.replace(/(?:\r\n|\r|\n)/g, '<br />');

		return out;
	};

	// Fetch twitter timeline demo data
	$.getJSON( "scripts/timeline.json", function( data ) {
		var updates = []; // Twitter updates
		$.each(data, function(index, rawUpdate) {
			var update = {};

			// If this is a retweet, use original message
			if (rawUpdate.retweeted_status) {
				var status = rawUpdate.retweeted_status;
			} else {
				var status = rawUpdate;
			}

			update.id_str = status.user.id_str;
			update.screen_name = status.user.screen_name;
			update.name = status.user.name;
			update.profile_image_url_https = status.user.profile_image_url_https;
			update.created_at = formatdate(status.created_at);
			update.text = linkify (status.text);

			if (status.quoted_status) {
				update.quoted_status = {};
				update.quoted_status.text = linkify (status.quoted_status.text);
				if (status.quoted_status.extended_entities.media) {
					update.quoted_status.media_url_https = status.quoted_status.extended_entities.media[0].media_url_https;
				}
			}

			if (status.extended_entities && status.extended_entities.media) {
				update.extended_entities = {};
				update.extended_entities.media_url_https = status.extended_entities.media[0].media_url_https;
			}


			updates.push(update);
		});

		var source   = $("#timeline-template").html();
		var template = Handlebars.compile(source);
		var context = updates;
		var html    = template(context);
		$('#timeline').html(html);
	});

});
