var https = require('https');

var Gister = (function() {
  var Gister = function() {

  };

  Gister.prototype = new (function() {
    var gister = this;

    this.baseURL = 'api.github.com';

    this.createGist = function(content, callback, fileName, description) {
      var fileName = fileName || 'file.txt';
      var files = {};
      var description = description || '';
      // Prepare the JSON data
      files[fileName] = {};
      files[fileName].content = content;
      var data = {
        description: description
        , public: true
      }
      data.files = files;
      console.log(JSON.stringify(data, undefined , 2));  // => "description=&public=true&files="
      data = JSON.stringify(data);
      // Issue a request
      var req = https.request({
        host: gister.baseURL
        , path: '/gists'
        , port: 443
        , method: 'POST'
        , headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          , 'Content-length': data.length
        }
        ,
      }, function(res, err) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
	  var data = JSON.parse(chunk);
          callback(data);
        });
      });
      req.write(data);
      req.end();
    }

    this.listGists = function(options) {
      if (options.user) {
    	var path = '/users' + user + '/gists'
      } else {
    	var path = '/gists';
      }
    };
  });

  return Gister;
})();

module.exports.Gister = Gister
