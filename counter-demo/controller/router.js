var url = require('url');
var querystring = require('querystring');


var Url = (function() {
  var Url = function() {
    var self = this;
  }

  Url.prototype = new (function() {
    var self = this;
    var currentUrl;
    var pathname;
    var query;

    this.parse = function(newUrl) {
      self.currentUrl = newUrl;
      self.pathname = url.parse(newUrl).pathname;
      self.query = url.parse(newUrl).query;
    };
  })();

  return Url;
})();
