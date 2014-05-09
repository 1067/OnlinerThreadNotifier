Parse.Cloud.job("checkForum", function(request, status) {
  var params = request.params;

  Parse.Cloud.httpRequest({
    url: params.forumUrl
  }).then(function(httpResponse) {
    return require("cloud/htmlParser").getLinks(httpResponse.text);
  }, function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
    status.error('Request failed with response code ' + httpResponse.status);
  }).then(function(parsed) {
    return require("cloud/linksModel").saveOnlyNew(parsed);
  }, function() {
    status.error("can't save new items");
  }).then(function(newItems) {
    var promise = new Parse.Promise();
  
    if (0 < newItems.length) {
      promise.resolve(newItems);
    } else {
      promise.reject();
    }

    return promise;
  }).then(function(newItems) {
    return require("cloud/emailSender").send({
      html: require("cloud/htmlBuilder").biuldLinks(params.forumUrl, newItems),
      mailgun: params.mailgun,
      emails: params.emails
    });
  }, function() {
    status.success("nothing changed");
  }).then(function(httpResponse) {
    console.log(httpResponse);
    status.success(params.html);
  }, function(httpResponse) {
    console.error(httpResponse);
    status.error(httpResponse);
  });
});