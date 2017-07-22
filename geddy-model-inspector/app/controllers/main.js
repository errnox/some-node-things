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



var child_process = require('child_process');


var Main = function () {
  var mainController = this;

  this.index = function (req, resp, params) {
    this.respond(params, {
      format: 'html'
    , template: 'app/views/main/index'
    });
  };

  this.info = function (req, resp, params) {
    var self = this;
    this.cmd = 'cal 2012';
    child_process.exec(self.cmd, function(err, cal) {
      if (err) {
	params['calendar'] = null;
      } else {
	params['calendar'] = cal;
      }
      params['cmd'] = self.cmd;
      self.respond(params, {
    	format: 'html'
    	, template: 'app/views/main/info'
      });
    });
  };

    
  this.index = function(req, res, params) {
    if (this.session.get('errorMessage')) {
      params['errorMessage'] = this.session.get('errorMessage');
    }
    if (this.session.get('command')) {
      params['command'] = this.session.get('command');
    }
    if (this.session.get('output')) {
      params['output'] = this.session.get('output');
    }


    this.respond(params, {
      format: 'html'
      , template: 'app/views/main/index'
    });
  };

  this.handleCommand = function(req, res, params) {
    var self = this;
    child_process.exec(params['command-textbox'], function(err, output) {
      if (err) {
	self.session.set('errorMessage', '\n\nInvalid command');
	self.session.set('command', params['command-textbox']);
	self.session.set('output', 'No output');
      } else {
	if (self.session.get('errorMessage')) {
	  self.session.unset('errorMessage');
	}
	self.session.set('command', params['command-textbox']);
	self.session.set('output', output);
      }

      self.redirect('/');
    });
  };

  this.showIssues = function(req, res, params) {
    var self = this;
    this.issueList;
    geddy.model.Issue.all(function(err, issues) {
      console.log('###########################################################################');
      console.log(issues);
      self.issueList = issues;
      // params['foos'] = params;
      params['allIssues'] = self.issueList;
      self.respond(params, {
	format: 'html'
	, template: 'app/views/main/issues'
      });
    });
  };

};


exports.Main = Main;


