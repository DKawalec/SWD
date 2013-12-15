function FileHandler() {
	'use strict';
	
	var self = this,
		permittedFileTypes = ['text/plain','application/json', 'application/x-javascript'],
		defaultData,
		contentValid = function(inputdata){
			var result;
			try{
				result = JSON.parse(inputdata);
			} catch (e) {
				return false;
			}
			return result;
		},
		fileContent;

	self.readDefault = function(){
		$.getJSON('./files/default.json').then(function(response){
			defaultData = response;
		});
	};

	self.getDefaultData = function(){
		return defaultData;
	};
	self.getFileContent = function(){
		return fileContent;
	};

	self.readFile = function(s) {
		var file = e.target.files[0];
		console.log(file);
		if(_.contains(permittedFileTypes, file.type)){
			var reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e){
				console.log('typeof check', typeof contentValid);
				var contents = reader.result,
					result = contentValid(contents);
				if(result){
					fileContent = result;
				} else {
					fileContent = undefined;
				}
			console.log(result);
			};
		} else {
			fileContent = undefined;
		}
	};
}