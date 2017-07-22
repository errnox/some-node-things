#!/usr/bin/env node


var fs = require('fs');


var Analyzer = (function() {
  function Analyzer() {
    var self = this;
  };

  Analyzer.prototype = new (function() {
    var self = this;
    this.freqList = {};

    this.parse = function(datafile, callback) {
      var parent = this;
      this.datafile = datafile;
      this.list = {};
      fs.readFile(this.datafile, 'UTF-8', function(err, data) {
      	parent.list = self._buildFreqList(data);
	callback(parent.list);
      });
      return this.list;
    };

    this._buildFreqList = function(data) {
      var tokens = data.split(' ').sort();
      var freqList = {};
      tokens.forEach(function(token) {
    	if (freqList.hasOwnProperty(token)) {
    	  ++freqList[token];
    	} else {
    	  freqList[token] = 0;
    	}
      });
      return freqList;
    };

    this.serialize = function(freqList, filename) {
      fs.writeFile(filename, JSON.stringify(freqList));
    };

    this.csv = function(freqList, separator) {
      this.separator = separator || ',';
      this.output = '';
      for (var key in freqList) {
	if (key.match(separator)) {
	  try {
	    throw new Error('Token must not contain separator.' + '\nToken: ' + key + '\nSeparator: ' + this.separator);
	  } catch(err) {
	    process.stderr.write(err.toString());
	  }
	}
      	this.output += key + this.separator + freqList[key].toString() + '\n';
      }
      return this.output;
    };

    this.each = function(freqList, callback) {
      for (var key in freqList) {
	callback(key, freqList[key]);
      }
    };

    this._sortBy = function(freqList, criterium, order) {
      var parent = this;
      this.criterium = criterium;
      this.order = order;
      var sortedFreqs = [];
      for (var key in freqList) {
	sortedFreqs.push([key, freqList[key]]);
      }
      return sortedFreqs.sort(function(a, b) {
      	if (parent.criterium === 'frequency') {
      	  if (parent.order === 'ascending') {
      	    return a[1] - b[1];
      	  } else {
      	    return b[1] - a[1];
      	  }
      	} else if (parent.criterium === 'tokens') {
      	  if (parent.order === 'ascending') {
	    return a[0] > b[0];
      	  } else {
	    return a[0] < b[0];
      	  }
      	}
      });
    };

    this.sortByFreq = function(freqList, order) {
      var order = order || 'ascending';
      return this._sortBy(freqList, 'frequency', order);
    };


    this.sortByTokensAlphabetically = function(freqList, order) {
      var order = order || 'ascending';
      return this._sortBy(freqList, 'tokens', order);
    };

  })();

  return Analyzer;
})();


module.exports.Analyzer = Analyzer;


var analyzer = new Analyzer();
analyzer.parse(__dirname + '/res/data', function(freqList) {
  //-----------------------------------------------------------------------
  // Serialize frequency list
  //-----------------------------------------------------------------------

  // analyzer.serialize(freqList, __dirname + '/res/serialized');


  //-----------------------------------------------------------------------
  // Get frequency list as CSV data
  //-----------------------------------------------------------------------

  // console.log(analyzer.csv(freqList));


  //-----------------------------------------------------------------------
  // Getting each token and frequence individually
  //-----------------------------------------------------------------------

  // analyzer.each(freqList, function(token, freq) {
  //   console.log(token + ', ' + freq)
  // });


  //-----------------------------------------------------------------------
  // Sort frequency list by frequency
  //-----------------------------------------------------------------------

  // console.log(analyzer.sortByFreq(freqList));
  // console.log(analyzer.sortByFreq(freqList, 'descending'));


  //-----------------------------------------------------------------------
  // Sort frequency list by tokens alphabetically
  //-----------------------------------------------------------------------

  // console.log(analyzer.sortByTokensAlphabetically(freqList));
  // console.log(analyzer.sortByTokensAlphabetically(freqList, 'descending'));
});

