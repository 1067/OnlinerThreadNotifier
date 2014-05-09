exports.biuldLinks = function(baseUrl, relatedLinks) {
  var template = "<%= obj.acc %>" + 
    "<p>" + 
      "<table><tr>" +
        "<td><div style='width: 100px;'><%= obj.relatedLink.userName %> :</div></td>" +
        "<td><a href='<%= obj.baseUrl %>#<%= obj.relatedLink.postId %>' target='_blank'>" + 
          "#<%= obj.relatedLink.postId %>" +
        "</a></td>" + 
      "</tr></table>"+
    "</p>";

  var _ = require("underscore");

  return _.foldl(relatedLinks, function(acc, relatedLink) {
    return _.template(template, {acc: acc, baseUrl: baseUrl, relatedLink: relatedLink});
  }, "");
};