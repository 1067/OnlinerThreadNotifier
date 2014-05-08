Parse.Cloud.job("checkForum", function(request, status) {
  var _ = require("underscore");

  var getEmailList = function() {
    return _.foldl(request.params.emails, function(acc, item) {return acc + ", " + item;});
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
    return html.match(/<a.*?href="#p.*?".*?>#<\/a>/g);
  };

  var url = request.params.forumUrl;

  var combineHtml = function(links) {
    return _.foldl(links, function(acc, item) {
      var href = item.match(/href.*?=.*?[',"]#.*?[',"]/g)[0];
      href = href.substring(6, href.length-1);

      return acc + '<p><a href="' + url + href + '"">' + href + '</a></p>';
    }, "");
  };

  var saveAndSend = function(newItems) {
    var CommentLink = Parse.Object.extend("CommentLink");

    var toAdd = _.map(newItems, function(item) {return new CommentLink({content: item});});

    CommentLink.saveAll(toAdd, {
      success: function(list) {
        sendEmail(combineHtml(newItems));
      },
      error: function() {
        status.error("can't save new items");
      }
    });
  };

  Parse.Cloud.httpRequest({
    url: url
  }).then(
    function(httpResponse) {
      var parsed = parseLinks(httpResponse.text);    

      new Parse.Query("CommentLink")
        .containedIn("content", parsed)
        .find()
        .then(function(results) {
          var mapped = _.map(results, function(item) {return item.get("content");});
          var newItems = _.filter(parsed, function(item) {return _.contains(mapped, item) === false;});

          if (0 < newItems.length) {
            saveAndSend(newItems);
          } else {
            status.success("nothing changed");
          }
        }, function() {
          status.error("can't retrieve items");
        });
    }
  ).fail(function(httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
    status.error('Request failed with response code ' + httpResponse.status);
  });
});