$(function() {

	// Ugly Firefox workaround
	$.ajaxSetup({beforeSend: function(xhr){
		if (xhr.overrideMimeType)
		{
			xhr.overrideMimeType("application/json");
		}
	}
	});




	Handlebars.registerHelper('formatDate', function(date) {
		return date.substr(0, 19);
	});


	Handlebars.registerHelper('linkify', function(tweet) {
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
	});

	// Fetch twitter timeline demo data
	$.getJSON( "scripts/timeline.json", function( data ) {
		var source   = $("#timeline-template").html();
		var template = Handlebars.compile(source);
		var context = data;
		var html    = template(context);
		$('#timeline').html(html);
	});

});
