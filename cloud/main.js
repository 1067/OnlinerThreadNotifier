Parse.Cloud.job("checkForum", function(request, status) {
  var params = request.params;
  var statusHandler = require("cloud/statusWrapper").wrap(status);

  Parse.Cloud.httpRequest({
    url: params.forumUrl
  }).then(function(httpResponse) {
    return require("cloud/htmlParser").getLinks(httpResponse.text);
  }, function(httpResponse) {
    statusHandler.error('Request failed with response code ' + httpResponse.status);
  }).then(function(parsed) {
    return require("cloud/linksModel").saveOnlyNew(parsed);
  }, function() {
    statusHandler.error("can't get links from html");
  }).then(function(newItems) {
    if (0 < newItems.length) {
      return Parse.Promise.as(newItems);
    } else {
      return Parse.Promise.error();
    }
  }, function() {
    status.error("can't save new items");
  }).then(function(newItems) {
    return require("cloud/emailSender").send({
      html: require("cloud/htmlBuilder").biuldLinks(params.forumUrl, newItems),
      mailgun: params.mailgun,
      emails: params.emails
    });
  }, function() {
    statusHandler.success("nothing changed");
  }).then(function(httpResponse) {
    statusHandler.success("mail sent");
  }, function(error) {
    console.log(error);
    statusHandler.error("mail wasn't sent");
  });
});