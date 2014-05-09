exports.biuldLinks = function(baseUrl, relatedLinks) {
  var template = "<%= obj.acc %>" + 
    "<p>" +
      "<a href='<%= obj.href %>' target='_blank'>" + 
        "<%= obj.name %>" +
      "</a>" + 
    "</p>";

  var _ = require("underscore");

  return _.foldl(relatedLinks, function(acc, relatedLinks) {
    return _.template(template, {acc: acc, href: baseUrl + relatedLinks, name: relatedLinks});
  }, "");
};