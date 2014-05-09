exports.biuldLinks = function(baseUrl, relatedLinks) {
  var template = "<%= obj.acc %>" + 
    "<p>" + 
      "<table cellspacing='0' cellpadding='0' style='border: none;width: 100%;''>" + 
        "<colgroup>" +
          "<col span='1' style='width: 100px;'>" +
        "</colgroup>" +
        "<tr style='background: #303030;color: #eeeeee;collapse:true;'>" +
          "<td><span style='margin-left: 10px;'><%= obj.relatedLink.userName %> :</span></td>" +
          "<td><a style='color:#d1d1f1;' href='<%= obj.baseUrl %>#<%= obj.relatedLink.postId %>' target='_blank'>" + 
            "#<%= obj.relatedLink.postId %>" +
          "</a></td>" + 
        "</tr>" +
        "<tr>" +
          "<td colspan='2'><div style='margin-left: 10px;'><%= relatedLink.message %></div></td>" +
        "</tr>" +
      "</table>"+
    "</p>";

  var _ = require("underscore");

  return _.foldl(relatedLinks, function(acc, relatedLink) {
    return _.template(template, {acc: acc, baseUrl: baseUrl, relatedLink: relatedLink});
  }, "");
};