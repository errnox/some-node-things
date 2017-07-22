var Logger = (function() {
  function Logger(name, level) {
    var self = this;
    this.name = name;
    this.level = level;
  }

  Logger.prototype = new (function() {
    this.log = function() {
      console.log(this.name + ' logger logs on level ' + this.level + '.');
    };

    this.executeThenLog = function(func, message) {
      func();
      console.log(message);
    };
  })();

  return Logger;
})();


module.exports.Logger = Logger;
