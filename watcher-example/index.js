#!/usr/bin/env node


var fs = require('fs');


fs.readFile('./input', 'utf8', function(err, data) {
  if (err) {
    throw err;
  }
  var lines = data.toString().split('\n');
  for (var i in lines) {
    console.log(lines[i]);
  }
});

// Alternatively, read from stream
//
// var input = fs.createReadStream('./input');
// for (var line in input) {
//   console.log(line);
// }
