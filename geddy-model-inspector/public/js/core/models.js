(function () {
var Issue = function () {

  this.defineProperties({
    title: {type: 'string', required: true},
    description: {type: 'string'},
    data: {type: 'array'},
  });

  this.validatesPresent('title');
  // this.validatesPresent('data');

  this.validatesLength('title', {min: 1, max: 1000});
  this.validatesLength('description', {max: 10000});

  // this.validatesWithFunction('data', function(data) {
  //   for (var i in data) {
  //     if (typeof data[i] !== 'number') {
  // 	if (typeof data[i] !== 'string') {
  // 	  if (data[i] !== undefined) {
  // 	    return false;
  // 	  }
  // 	}
  //     }
  //   }
  // });

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Issue.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Issue.someStaticMethod = function () {
  // Do some other stuff
};
Issue.someStaticProperty = 'YYZ';
*/

Issue = geddy.model.register('Issue', Issue);

}());