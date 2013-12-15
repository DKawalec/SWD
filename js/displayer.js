function Displayer() {
	"use strict";
	var self = this;

	self.displayForm = function() {
		$('#form').show();
		$('#results').hide();
		return "DisplayFormTest";
	};

	self.displayResults = function(results) {
		$('#form').hide();
		
		$('#decision').text(results.name);
		$('#description').text(results.description);
		$('#partylogo').attr("src", results.imgurl);
		
		$('#results').show();

		return "DisplayResultsTest"+results;
	};
}
