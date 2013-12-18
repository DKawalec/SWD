function Controller() {
	"use strict";

	var self = this,
		displayer = new Displayer(),
		inputReader = new InputReader(),
		fileReader = new FileHandler(),
		decisionMaker = new DecisionMaker();

	self.initApp = function(){
		decisionMaker.init();
		fileReader.readDefault();
		displayer.displayForm();
	};

	self.grabFile = function(e){
		fileReader.readFile(e);
	}

	self.run = function(){
		var	fileContent = fileReader.getFileContent() || fileReader.getDefaultData(),
			setup = inputReader.getValues(),
			answer = decisionMaker.decide(fileContent, setup);

		displayer.displayResults(fileContent[answer.decision], answer.consistency);
	};

	self.restart = function(){
		self.initApp();
	};
}