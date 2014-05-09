var _ = require("underscore");

exports.getContainedIn = function(values) {
  return new Parse.Query("CommentLink")
    .containedIn("postId", _.pluck(values, "postId"))
    .find()
    .then(function(saved) {
      return _.map(saved, function(item) {return _.pick(item.toJSON(), ["postId", "userName"]);});
    });
};

exports.save = function(newItems) {
  var CommentLink = Parse.Object.extend("CommentLink");

  var toAdd = _.map(newItems, function(item) {return new CommentLink(item);});

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
    var savedIds = _.pluck(saved, "postId");
    var newItems = _.filter(values, function(item) { return _.contains(savedIds, item.postId) === false; });

    return self.save(newItems);
  });
};