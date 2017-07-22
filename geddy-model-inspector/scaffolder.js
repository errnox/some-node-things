#!/usr/bin/env node


var child_process = require('child_process');
var fs = require('fs');

var model = JSON.parse(fs.readFileSync(__dirname + '/model.json', 'utf8'));

var scaffold = 'geddy scaffold ' + model.name + ' ';

for (var property in model.properties) {
  scaffold += ' '+ model.properties[property].name + ':'
    + model.properties[property].type;
}

console.log('Scaffolding: ' + scaffold);
child_process.exec(scaffold);
console.log('Scaffolding done');

