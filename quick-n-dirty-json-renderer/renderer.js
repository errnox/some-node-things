#!/usr/bin/env node


var fs = require('fs');
var child_process = require('child_process');
var $ = require('jquery');

var REPLACEMENT = 'NIL';
var COLON = ': ';
var URI_REGEX = '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?';
var dataFile = __dirname + '/res/json/data5.json';
var outFile = __dirname + '/res/html/data.html';
var data = JSON.parse(fs.readFileSync(dataFile));
var addColon = true;

// Subset of valid HTML tags
var tag = {
  open: {
    table: '<table style="border: 1px solid red; border-spacing: 0;">'
    , th: '<th>'
    , tr: '<tr>'
    , td: '<td style="border: 1px solid red; vertical-align: top; text-align: left;">'
  }
  , close: {
    table: '</table>'
    , th: '</th>'
    , tr: '</tr>'
    , td: '</td>'
  }
}

var href = function(uri) {
  var description = uri;
  if (addColon) {
    description += COLON;
  }
  return '<a href=\"' + uri + '\">' + description + '</a>';
};

var linkify = function(url, specialMarkup) {
  var specialMarkup = specialMarkup || false;
  if (url.match(URI_REGEX)) {
    return href(url);
  } else {
    if (addColon) {
      url += COLON;
    }
    if (specialMarkup) {
      url = '<ul><li>' + url + '</li></ul>';
    }
    return url;
  }
}

var render = function(json, parentIsArray, isNotRoot) {
  var isNotRoot = isNotRoot || false;
  var parentIsArray = parentIsArray || false;
  // Special situation: the root element is of type Array
  // (Hack: Just pretend it has a parent which is of type Array)
  // This might cause trouble if parentIsArray is taken literally in future
  // code.
  if (!isNotRoot) {
    if (json.constructor === Array) {
      parentIsArray = true;
    }
  }
  console.log('parentType: ' + parentIsArray + ' <- ' + json);
  var s = '';
  var properties = Object.getOwnPropertyNames(json);
  if (json.constructor === Array) {
    properties.pop();
  }
  s += tag.open.table;
  for (var i in properties) {
    var currentProperty = properties[i];
    var currentEntity = json[properties[i]];

    s += tag.open.tr;
    if (typeof currentEntity == 'object' && currentEntity !== null &&
    	currentEntity !== undefined) {
      s += tag.open.td;
      s += linkify(encodeURI(currentProperty), parentIsArray);
      s += tag.close.td;

      s += tag.open.td;
      s += render(currentEntity, currentEntity.constructor === Array,
		  true);
      s += tag.close.td;
    } else if (currentEntity !== null && currentEntity !== undefined) {
      s += tag.open.td;
      s += linkify(encodeURI(currentProperty), parentIsArray);
      s += tag.close.td;

      s += tag.open.td;
      if (typeof currentEntity === 'string') {
	addColon = false;  // No colons for 'leaf entities'
	s += linkify(currentEntity, false);  // No special markup
	addColon = true;  // All other entities should have colons, though
      } else {
	s += currentEntity;
      }
      s += tag.close.td;
    } else {
      s += tag.open.td;
      s += linkify(encodeURI(currentProperty), parentIsArray);
      s += tag.close.td;

      s += tag.open.td;
      addColon = false;  // No colons for 'leaf entities'
      s += linkify(encodeURI(REPLACEMENT), false);
      addColon = true;  // All other entities should have colons, though
      s += tag.open.td;
    }
    s += tag.close.tr;
  }
  s += tag.close.table;
  return s;
};

var renderedData = render(data);
fs.writeFile(outFile, renderedData, function(err) {});


// Pretty print the HTML output
// ----------------------------
//
// var prettyPrintCommand = 'echo \"' + render(data) + '\" | xmllint --format -';
// child_process.exec(prettyPrintCommand, function(err, output) {
//   if (err) {
//     console.log(err);
//   } else {
//     fs.writeFile(outFile, output, function(err) {
//       if (err) {
// 	throw err;
//       }
//       console.log(output);
//       console.log('HTML written to: ' + outFile);
//     });
//   }
// });


// Notes
// -----
//
// Using 'open' or child_process.spawn carries the risk of not working
// correctly. If a file:// url for a local file is used on a DEBIAN system,
// then xdg-open is used to open the file. xdg-open, however, tries using
// sensible-browser, which will end up using www-browser instead of
// x-www-browser if $DISPLAY is not set adequately. An ugly hack would be
// to set $DISPLAY correctly and restore it afterwards. This, however may
// cause side effects.
//
// So this will fail:
//
// var fileURI = 'file:/' + outFile;
// open(fileURI);
// open('http://www.google.com');
//
// This will fail, too:
//
// child_process.spawn('open', ['file://' + outFile]);
//
// The only sensible option here is:
//
// child_process.exec('$BROWSER ' + outFile, function(err, output) {
//   if (err) {
//     throw err
//   } else {
//     console.log(output);
//   }
// });
