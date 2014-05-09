Parse.Cloud.job("checkForum", function(request, status) {
  var _ = require("underscore");

  var getEmailList = function() {
    return _.foldl(request.params.emails, function(acc, item) {return acc + ", " + item;}, "");
  };

  var sendEmail = function(html) {
    console.log(html);

    var Mailgun = require('mailgun');
    var mailgunConf = request.params.mailgun;

    Mailgun.initialize(mailgunConf.appDomain, mailgunConf.appKey);

    Mailgun.sendEmail({
      to: getEmailList(),
      from: "Mailgun@CloudCode.com",
      subject: "Thread updated on onliner's forum",
      html: html
    }, {
      success: function(httpResponse) {
        console.log(httpResponse);
        status.success(html);
      },
      error: function(httpResponse) {
        console.error(httpResponse);
        status.error(httpResponse);
      }
    });
  };

  var parseLinks = function(html) {
    var regexAnchaors = /<a.*?href="#p.*?".*?>#<\/a>/g;
    var regexLink = /href.*?=.*?[',"]#.*?[',"]/g;

    return _.map(html.match(regexAnchaors), function(item) {
      var href = item.match(regexLink)[0];
      return href.substring(6, href.length-1);
    });
  };

  var url = request.params.forumUrl;

  var combineHtml = function(links) {
    var template = "<%= obj.acc %>" + 
      "<p>" +
        "<a href='<%= obj.href %>'>" + 
          "<%= obj.name %>" +
        "</a>" + 
      "</p>";

    return _.foldl(links, function(acc, link) {
      return _.template(template, {acc: acc, href: url + link, name: link});      
    }, "");
  };

  var saveAndSend = function(newItems) {
    var CommentLink = Parse.Object.extend("CommentLink");

    var toAdd = _.map(newItems, function(item) {return new CommentLink({content: item});});

    CommentLink.saveAll(toAdd, {
      success: function() {
        sendEmail(combineHtml(newItems));
      },
      error: function() {
        status.error("can't save new items");
      }
    });
  };

  var getParsed = Parse.Cloud.httpRequest({
    url: url
  }).then(function(httpResponse) {
    return parseLinks(httpResponse.text);
  }, function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
    status.error('Request failed with response code ' + httpResponse.status);
  });

  var findSaved = getParsed.then(function(parsed) {
    return new Parse.Query("CommentLink").containedIn("content", parsed).find();
  }, function() {
    status.error("can't retrieve saved items");
  });

  Parse.Promise.when(
    getParsed, findSaved
  ).then(function(parsed, saved) {
    var mapped = _.map(saved, function(item) {return item.get("content");});
    var newItems = _.filter(parsed, function(item) {return _.contains(mapped, item) === false;});

    if (0 < newItems.length) {
      saveAndSend(newItems);
    } else {
      status.success("nothing changed");
    }
  });
});