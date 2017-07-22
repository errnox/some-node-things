var Issues = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Issue.all(function(err, issues) {
      self.respond({params: params, issues: issues});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , issue = geddy.model.Issue.create(params);

    issue.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Issue.first(params.id, function(err, issue) {
      self.respond({params: params, issue: issue.toObj()});
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Issue.first(params.id, function(err, issue) {
      self.respond({params: params, issue: issue});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Issue.first(params.id, function(err, issue) {
      issue.updateProperties(params);

      issue.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Issue.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Issues = Issues;
