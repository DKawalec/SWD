function Controller() {
	"use strict";

	var self = this,
		displayer = new Displayer(),
		inputReader = new InputReader(),
		fileReader = new FileHandler(),
		decisionMaker = new DecisionMaker();

	self.initApp = function(){
		fileReader.readDefault();
		displayer.displayForm();
	};

	self.grabFile = function(e){
		fileReader.readFile(e);
	}

	self.run = function(){
		var	fileContent = fileReader.getFileContent() || fileReader.getDefaultData(),
			setup = inputReader.getValues(),
			decision = decisionMaker.decide(fileContent, setup);

		displayer.displayResults(fileContent[decision]);
	};

	self.restart = function(){
		self.initApp();
	};
}