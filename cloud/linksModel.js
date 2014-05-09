var _ = require("underscore");

exports.getContainedIn = function(values) {
  return new Parse.Query("CommentLink")
    .containedIn("content", values)
    .find()
    .then(function(saved) {
      return _.map(saved, function(item) {return item.get("content");});
    });
};

exports.save = function(newItems) {
  var CommentLink = Parse.Object.extend("CommentLink");

  var toAdd = _.map(newItems, function(item) {return new CommentLink({content: item});});

  var promise = new Parse.Promise();

  CommentLink.saveAll(toAdd, {
    success: function() {
      promise.resolve(newItems);
    },
    error: function(error) {
      promise.reject(error);
    }
  });

  return promise;
};

exports.saveOnlyNew = function(values) {
  var self = this;
  
  return self.getContainedIn(values).then(function(saved) {
    return self.save(_.difference(values, saved));
  });
};