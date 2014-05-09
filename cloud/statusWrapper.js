exports.wrap = function(status) { 
  return {
    handled: false,
    handle: function(callback, message) {
      if (this.handled == false) {
        console.log(message);
        callback.call(status, message);
      }

      this.handled = true;
    },
    success: function(message) {
      this.handle(status.success, message);
    },
    error: function(message) {
      this.handle(status.error, message);
    }
  };
};
