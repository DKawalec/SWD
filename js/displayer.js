function Displayer() {
	"use strict";
	var self = this;

	self.displayForm = function() {
		$('#form').show();
		$('#results').hide();
		return "DisplayFormTest";
	};

	self.displayResults = function(results, consistency) {
		$('#form').hide();

		$('#decision').text(results.name);
		$('#description').text(results.description);
		$('#partylogo').attr("src", results.imgurl);
		
		if(consistency) $('#consistency_warning').hide();
		else $('#consistency_warning').show();
		$('#results').show();

		return "DisplayResultsTest"+results;
	};
}
