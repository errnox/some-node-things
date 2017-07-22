// Dispatching:
// 
// - Use setTimeout to define a fixed period of time to wait for multiple
//   uiChange events.
// - Dispatch the aggregated data in one go to create a new model.
// - Provide fail-mode to serialize data during timeout periods;
//   automatically rewrite them on restart after fails.
// 
// 
// File rewriting:
//  
// - Create default model object containing all models, model properties,
//   datatypes, requires, presents, min/max lenths.
// - Update default model via UIChangeDispatcher.
// - Apply the model to the template (Use Geddy's
//   geddy/templates/scaffold/model.ejs template) and generate the new
//   model files.
// - Rename the old model files.
// - Write the new file.
// - Delete the old model files.


// @class UIChangeDispatcher Receives UI change events and dispatches them.
//   UI changes are identified by the name of the UI component. Therefore
//   the following convention applies for UI component names:
//   ```
//   ```
//     <ModelName>-<PropertyName>-<Identifier>-<UIElementDescription>
//   ```
//
//   Example:
//
//   ```
//     User-name-datatype-combobox
//   ```

var defaultModel = require('./default_model')
, fs = require('fs')
, ejs = require('ejs');


var UIChangeDispatcher = (function() {
  var UIChangeDispatcher = function() {
    
  };

  UIChangeDispatcher.prototype = new function() {
    // @method dispatch Takes a change object and dispatches it
    // @param {Object} change Change object of the form {name: "Foo",
    //   value: 123}
    this.infile = __dirname + '/template/model.js.ejs';
    this.outfile = __dirname + '/template/model.js';

    this._counter = 0;

    // @method UIChangeDispatcher._createNestedObject Creates nested
    //   objects from an array of descriptors
    // @param {Object} obj Any arbitrary base obect.
    // @param {Array} keyPath Array of descriptors for the nested object
    // @param {Object}} value Optional value for the innermost object. If
    //   no value is given, `{}` is used as default value
    this._createNestedObject = function assign(obj, keyPath, value) {
      lastKeyIndex = keyPath.length - 1;
      for (var i = 0; i < lastKeyIndex; ++i) {
	key = keyPath[i];

	// console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
	// console.log('KEY: ' + key);
	// console.log('OBJ: ' + JSON.stringify(obj));

	if (!(key in obj)) {
	  obj[key] = {}
	}
	obj = obj[key];
      }
      obj[keyPath[lastKeyIndex]] = value || {};
    };

    this._exists = function(obj, prop) {
      var parts = prop.split('.');
      for(var i = 0, l = parts.length; i < l; i++) {
	var part = parts[i];
	if(obj !== null && typeof obj === "object" && part in obj) {
	  obj = obj[part];
	}
	else {
	  return false;
	}
      }
      return true;
    }

    this.dispatch = function(change) {
      var nameComponents = change.name.split('-');

      var modelName = nameComponents[0];
      var propertyName = nameComponents[1];
      var identifier = nameComponents[2];
      var uiElementDescription = nameComponents[3];

      var value = change.value;

      var self = this;
      this.model = geddy.model.descriptionRegistry[modelName];

      if (identifier === 'datatype') {
	this._createNestedObject(self.model.properties[propertyName],
				 ['datatype'], value)
      }

      if (identifier === 'required') {
	this._createNestedObject(self.model.properties[propertyName],
				 ['options', 'name', 'required'], value)
      }

      if (identifier === 'present') {
	if (value === true) {
	  this._createNestedObject(self.model.properties[propertyName],
				   ['validations', 'present'])
	} else {
	  delete self.model.properties[propertyName], ['validations',
						       'present'];
	}
      }

      if (identifier === 'minlength') {
	this._createNestedObject(self.model.properties[propertyName],
				 ['validations', 'length', 'min'], value)
      }

      if (identifier === 'maxlength') {
	this._createNestedObject(self.model.properties[propertyName],
				 ['validations', 'length', 'max'], value)
      }

      ++this._counter;

      console.log('VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
      console.log('Counter: ' + this._counter);
      console.log(JSON.stringify(this.model, undefined, 2));

      var str = fs.readFileSync(this.infile, 'utf8');


      fs.writeFile(this.outfile, ejs.render(str, {model: geddy.model,
						  _exists: this._exists}),
		   'utf8', function(err, data) {
		     if (err) {
		       throw err;
		     }
		   });



      fs.writeFile(this.outfile, ejs.render(str, {model: self.model,
						  _exists: this._exists}),
		   'utf8', function(err, data) {
		     if (err) {
		       throw err;
		     }
		   });
    };

    this.liveUpdateDatatype = function(model, property, value) {
      geddy.model[model][property].datatype = value;
    };

    this.UpdateRequired = function(model, property, value) {
      geddy.model[model][property].options.name.required = value;
    };

    this.liveUpdatePresent = function(model, property, value) {
      if (value == true) {
	geddy.model[model][property].validations.present = {};
      }
    };

    this.liveUpdateMinLength = function(model, property, value) {
      if (parseInt(value)) {
	geddy.model[model][property].validations.length.min = parseInt(value);
      }
    };

    this.liveUpdateMaxLength = function(model, property, value) {
      if (parseInt(value)) {
	geddy.model[model][property].validations.length.max = parseInt(value);
      }
    };

  };

  return UIChangeDispatcher;
})();

module.exports.UIChangeDispatcher = UIChangeDispatcher;

