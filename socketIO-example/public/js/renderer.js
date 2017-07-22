var Renderer = (function() {
  var Renderer = function() {
    
  };

  Renderer.prototype = new (function() {

    var root = this;

    var REPLACEMENT = 'NIL';
    var COLON = ': ';
    var URI_REGEX = '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?';
    var addColon = true;


    // Subset of valid HTML tags
    this.tag = {
      open: {
	table: '<table>'
	, th: '<th>'
	, tr: '<tr>'
	, td: '<td>'
      }
      , close: {
	table: '</table>'
	, th: '</th>'
	, tr: '</tr>'
	, td: '</td>'
      }
    }

    this.href = function(uri) {
      var description = uri;
      if (addColon) {
	description += COLON;
      }
      return '<a href=\"' + uri + '\">' + description + '</a>';
    };

    this.linkify = function(url, specialMarkup) {
      var specialMarkup = specialMarkup || false;
      if (url.match(URI_REGEX)) {
	return root.href(url);
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

    this.render = function(json, parentIsArray, isNotRoot) {
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
      var s = '';
      var properties = Object.getOwnPropertyNames(json);
      if (json.constructor === Array) {
	properties.pop();
      }
      s += root.tag.open.table;
      for (var i in properties) {
	var currentProperty = properties[i];
	var currentEntity = json[properties[i]];

	s += root.tag.open.tr;
	if (typeof currentEntity == 'object' && currentEntity !== null &&
    	    currentEntity !== undefined) {
	  s += root.tag.open.td;
	  s += root.linkify(encodeURI(currentProperty), parentIsArray);
	  s += root.tag.close.td;

	  s += root.tag.open.td;
	  s += root.render(currentEntity, currentEntity.constructor === Array,
		      true);
	  s += root.tag.close.td;
	} else if (currentEntity !== null && currentEntity !== undefined) {
	  s += root.tag.open.td;
	  s += root.linkify(encodeURI(currentProperty), parentIsArray);
	  s += root.tag.close.td;

	  s += root.tag.open.td;
	  if (typeof currentEntity === 'string') {
	    addColon = false;  // No colons for 'leaf entities'
	    s += root.linkify(currentEntity, false);  // No special markup
	    addColon = true;  // All other entities should have colons, though
	  } else {
	    s += currentEntity;
	  }
	  s += root.tag.close.td;
	} else {
	  s += root.tag.open.td;
	  s += root.linkify(encodeURI(currentProperty), parentIsArray);
	  s += root.tag.close.td;

	  s += root.tag.open.td;
	  addColon = false;  // No colons for 'leaf entities'
	  s += root.linkify(encodeURI(REPLACEMENT), false);
	  addColon = true;  // All other entities should have colons, though
	  s += root.tag.open.td;
	}
	s += root.tag.close.tr;
      }
      s += root.tag.close.table;
      return s;
    };


  })();

  return Renderer;
}).call(this);


// Sample Usage
//
//var renderedData = render(data);
