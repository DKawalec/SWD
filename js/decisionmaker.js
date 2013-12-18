function DecisionMaker ()  {
	"use strict";

	var self = this,
		RIs = [0, 0, 0.52, 0.89, 1.11, 1.25, 1.35, 1.4, 1.45, 1.49, 1.51, 1.54, 1.56, 1.57, 1.58],
		consistencyTreshold = 0.1,
		keys = [],
		optsNum = 0,
		prefMatrix = [],
		prefMatrix_norm = [],
		prefMatrix_avg = [],
		ranking = [],
		matrices = {},
		//macierz preferencji - wagi kryteriów
		buildPrefMatrix = function (prefs) {
			var prefs = _.sortBy(prefs, function (obj) {return -1*obj.weight}),
				weights = _.pluck(prefs, 'weight');
				

			for (var i = 0; i<weights.length; i++) {
				prefMatrix[i] = [];

				for (var j = 0; j<weights.length; j++) {
					var diff = weights[i]-weights[j]+1;
					if (diff < 1) diff = 1/prefMatrix[j][i];
					prefMatrix[i][j] = diff;
				}
			}
			keys = _.pluck(prefs, 'name');
		},
		matrixForPref = function (prefName, parties) {
			var result = [];
			for (var i = 0; i < optsNum; i++){
				var temp;
				result[i] = [];
				for (var j = 0; j < optsNum; j++){
					if (i===j){
						temp = parties[j].values[prefName];
						result[i][j] = 1;
					} else if (i > j) result[i][j] = 1/result[j][i];
					else result[i][j] = parties[j].values[prefName]/temp;
				}
			}
			return result;
		},
		buildMatrices = function (parties, prefs) {
			//zwraca dane o partiach pokazujące RÓŻNICĘ poglądów
			var parties = opinionate(parties, prefs);
			
			for (var i = 0; i < keys.length; i++) 
				matrices[keys[i]] = matrixForPref(keys[i], parties);
		},
		buildNormalizedMatrices = function () {
			prefMatrix_norm = normalize(prefMatrix);
			for(var i in matrices) 
				matrices[i+'_norm'] = normalize(matrices[i]);
		},
		calcAverages = function () {
			prefMatrix_avg = avgRows(prefMatrix_norm);
			for(var i in matrices) {
				if(i.indexOf('_')===-1) matrices[i+'_avg'] = avgRows(matrices[i+'_norm']);
			}
		},
		checkConsistency = function() {
			var lambda = lambdaMax(prefMatrix, prefMatrix_avg),
				ci = (lambda - prefMatrix.length)/(prefMatrix.length-1),
				cr = ci/RIs[prefMatrix.length-1];
							
			if(cr > consistencyTreshold) return false;

			for(var i in matrices) if(i.indexOf('_')===-1){
				lambda = lambdaMax(matrices[i], matrices[i+'_avg']);
				ci = (lambda - matrices[i].length)/(matrices[i].length-1);
				cr = ci/RIs[matrices[i].length-1];
				
				if(cr > consistencyTreshold) return false;
			}

			return true;
		},
		buildRanking = function(){
			var result = [];
			for(var i in matrices) if(i.indexOf('_avg')!==-1){
				var prefName = i.split('_')[0],
					prefIndex = keys.indexOf(prefName);
				matrices[prefName+'_weighted'] = [];
				for(var j = 0; j < matrices[i].length; j++)
					matrices[prefName+'_weighted'][j]=matrices[i][j]*prefMatrix_avg[prefIndex];
			}
			for(var i = 0; i < optsNum; i++){
				result[i] = 0;
				for(var j in matrices) if(j.indexOf('_weighted')!==-1)
					result[i] += matrices[j][i];
			}
			ranking = result;
		},
		opinionate = function (parties, prefs) {
			for (var i = 0; i < optsNum; i++) 
				for (var j in parties[i].values){
					var temp = parties[i].values[j];
					parties[i].values[j] = Math.abs(prefs[j].value - temp)+1;
				}

			return parties;
		}, 
		normalize = function (matrix) {
			var cols = _.zip.apply(_, matrix),
				sums = [],
				result = [];
			for (var i = 0; i < cols.length; i++)
				sums[i] = sum(cols[i]);
			for (var i = 0; i < matrix.length; i++){
				result[i] = [];
				for (var j = 0; j < matrix.length; j++){
					result[i][j] = matrix[i][j]/sums[j];
				}
			}
			return result;
		},
		avgRows = function (matrix) {
			var result = [];
			for(var i = 0; i < matrix.length; i++)
				result[i] = sum(matrix[i])/matrix[i].length;
			return result;
		},
		lambdaMax = function (matrix, avgRows) {
			var cols = _.zip.apply(_, matrix),
				sums = [],
				result = 0;
			for (var i = 0; i < cols.length; i++) sums[i] = sum(cols[i]);
			for (var i = 0; i < sums.length; i++) result += sums[i]*avgRows[i];
			return result;
		},
		sum = function (arr) {
			return _.reduce(arr, function(memo, num){ return memo + num;}, 0);
		};

	self.decide = function (fileContent, userInput) {
		var consistency;
		optsNum = fileContent.length;
		buildPrefMatrix (userInput);
		buildMatrices (fileContent, userInput);
		buildNormalizedMatrices();
		calcAverages();
		consistency = checkConsistency();
		buildRanking();
		return {decision: ranking.indexOf(_.max(ranking)), consistency: consistency };
	};

	//reset zmiennych prywatnych
	self.init = function () {
		keys = [];
		optsNum = 0;
		prefMatrix = [];
		prefMatrix_norm = [];
		prefMatrix_avg = [];
		ranking = [];
		matrices =  {};
	};
}