function InputReader() {
	"use strict";

	var self = this;

	self.getValues = function() {
		var opinionJson = {
			social: {},
			economy: {},
			religion: {},
			immigration: {},
		};

		for(var i in opinionJson){
			opinionJson[i] = {
				value: parseInt($('#'+i).val()),
				weight: parseInt($('#weight_'+i).val())
			}
		}

		return opinionJson;
	};
}