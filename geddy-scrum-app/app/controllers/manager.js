/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


// Importing datatypes does not allow generating a list of valid datatypes
// as it is polluted with other objects and does not allow distinguish them
// var datatypes = require('geddy').datatypes;

var Manager = function () {

  // Checks if an Object is empty (empty means: {})
  this._isEmpty = function(obj) {
    for (var i in obj) {
      return false;
    }
    return true;
  };

  this._getAllModels = function() {
    return geddy.model.descriptionRegistry;
  };

  this.index = function (req, resp, params) {
    var m = {};
    var models = this._getAllModels();
    console.log('---------------------------------------------------------------------------');
    console.log(JSON.stringify(models, undefined, 2));
    var modelNames = Object.getOwnPropertyNames(models);
    var ignored = ['createdAt', 'updatedAt']

    for (var i in modelNames) {
      var modelName = modelNames[i];
      var model = models[modelName];
      var propertyNames = Object.getOwnPropertyNames(model.properties);
      // Remove ignored properties
      for (var i in ignored) {
	var idx = propertyNames.indexOf(ignored[i]);
	console.log(ignored[i]);
	propertyNames.splice(idx, 1);
      }

      var properties = {};
      for (var i in propertyNames) {
	var name = propertyNames[i];
	var datatype = model.properties[name].datatype;
	var required = model.properties[name].options[name].required||
	  false;

	var validations = {
	  present: false
	  , length: {
	    qualifier: {
	      min: 'none'
	      , max: 'none'
	    }
	  }
	  , withFunction: false
	};

	if (model.properties[name].validations.length) {
	  if (model.properties[name].validations.length.qualifier) {
	    if (model.properties[name].validations.length.qualifier.min) {
	      validations.length.qualifier.min =
		model.properties[name].validations.length.qualifier.min;
	    }
	    if (model.properties[name].validations.length.qualifier.max) {
	      validations.length.qualifier.max =
		model.properties[name].validations.length.qualifier.max;
	    }
	  }
	}

	if (model.properties[name].validations.present) {
	  validations.present = true;
	}

	if (model.properties[name].validations.withFunction) {
	  validations.withFunction = "none";
	}

	properties[name] = {
	  datatype: datatype
	  , required: required
	  , validations: validations
	};
      }

      m[modelName] = properties;

      console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg');
      console.log(JSON.stringify(m, undefined, 2));

    }
    params['models'] = m;

    // Checkboxes need to know all valid datatypes
    // Accessing datatypes directly does not work, however:
    // params['datatypes'] = geddy.model.datatypes;
    // params['datatypes'] = geddy.datatypes;
    // So they have to be set manually in controllers:
    // XXX
    params['datatypes'] = [
      'string'
      , 'text'
      , 'number'
      , 'int'
      , 'boolean'
      , 'object'
      , 'array'
      , 'datetime'
      , 'date'
      , 'time'
    ];
    
    console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
    console.log(params);

    var p = {};
    p.models = params.models;
    p.datatypes = params.datatypes;
    geddy.io.sockets.on('connection', function(socket) {
      console.log('PARAMS: ' + JSON.stringify(params.datatypes));
      geddy.io.sockets.emit('modelChange', p);
    });

    this.respond(params, {
      format: 'html'
      , template: 'app/views/manager/index'
    });

  };

};

exports.Manager = Manager;


