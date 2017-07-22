#!/usr/bin/env node


var fs = require('fs');


// fs.readFile('./data/input', 'utf8', function(err, data) {
//   if (err) {
//     throw err;
//   }
//   var lines = data.toString().split('\n');
//   for (var i in lines) {
//     console.log(lines[i]);
//   }
// });


fs.watch(__dirname + '/data/input',
	     { persistent: true, interval: 5007 },
	     function(event, filename) {
	       console.log('Change: ' + filename + ' - ' +
			   JSON.stringify(event, undefined, 2));  // DEBUG
	     });

