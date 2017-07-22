
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
var UIChangeDispatcher = (function() {
  var UIChangeDispatcher = function() {
    
  };

  UIChangeDispatcher.prototype = new function() {
    // @method dispatch Takes a change object and dispatches it
    // @param {Object} change Change object of the form {name: "Foo",
    //   value: 123}
    this.dispatch = function(change) {
      var nameComponents = change.name.split('-');

      var modelName = nameComponents[0];
      var propertyName = nameComponents[1];
      var identifier = nameComponents[2];
      var uiElementDescription = nameComponents[3];

      var value = change.value;
    };

    this.UpdateDatatype = function(model, property, value) {
      geddy.model[model][property].datatype = value;
    };

    this.UpdateRequired = function(model, property, value) {
      geddy.model[model][property].options.name.required = value;
    };

    this.UpdatePresent = function(model, property, value) {
      if (value == true) {
	geddy.model[model][property].validations.present = {};
      }
    };

    this.UpdateMinLength = function(model, property, value) {
      if (parseInt(value)) {
	geddy.model[model][property].validations.length.min = parseInt(value);
      }
    };

    this.UpdateMaxLength = function(model, property, value) {
      if (parseInt(value)) {
	geddy.model[model][property].validations.length.max = parseInt(value);
      }
    };

  };

  return UIChangeDispatcher;
}).();

