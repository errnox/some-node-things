
var child_process = require('child_process');


var Debug = function () {
  var mainController = this;

  this.index = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };
};


exports.Debug = Debug;


