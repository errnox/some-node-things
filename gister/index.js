#!/usr/bin/env node


var Gister = require('./gister').Gister;


var gister = new Gister();

var string = 'This is a test.';
gister.createGist(string, function(data) {
  console.log(JSON.stringify(data, undefined, 2));
});
