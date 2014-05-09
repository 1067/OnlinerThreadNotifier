var _ = require("underscore");

var findUserName = function(html, postId) {
	var regexTemplate = 'id="<%= obj %>"[.\\s\\S]*?#postform[..\\s\\S]*?<\/a>';
	var regexUserName = />.*?<\/a>/;

	var regexBound = new RegExp(_.template(regexTemplate, postId));

	var dirty = html.match(regexBound)[0].match(regexUserName)[0];
	return dirty.substring(1, dirty.length - 4).trim();
};

exports.getLinks = function(html) {
  var regexAnchors = /<a.*?href="#p.*?".*?>#<\/a>/g;
  var regexLink = /href.*?=.*?[',"]#.*?[',"]/g;

  return _.map(html.match(regexAnchors), function(item) {
    var href = item.match(regexLink)[0];
    var postId = href.substring(7, href.length - 1);

    return {
        postId: postId,
        userName: findUserName(html, postId)
    };
  });
};