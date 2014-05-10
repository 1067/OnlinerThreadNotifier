var commonTemplate = "" + 
  "<table style='width:100%;border-collapse:collapse;'>" +
    "<tbody>" + 
      "<tr><%= obj %></tr>" +
    "</tbody>" +
  "</table>";

var itemTemplate = "" +
"<td style='background:#f5f5f5;padding:10px 10px 0;font:14px/1.4285714 Arial,sans-serif;'>" +
  "<table style='width:100%;border-collapse:collapse;'>" +
    "<tbody>" +
      "<tr>" +
        "<td style='padding:5px 0 15px;color:#707070;'>" +
          "<table style='width:100%;border-collapse:collapse;'><tbody>" +
            "<tr>" +
              "<td style='padding:0'><%= obj.relatedLink.userName %></td>" +
              "<td style='padding:0'></td>" +
              "<td style='text-align:right;width:100px;padding:0;'>" +
                "<a href='<%= obj.baseUrl %>#<%= obj.relatedLink.postId %>' style='color:#3b73af;text-decoration:none;' target='_blank'>link to post</a>" +
              "</td>" +
            "</tr>" +
          "</tbody></table>" +
        "</td>" +
      "</tr>" +
      "<tr>" +
        "<td style='font:14px/1.4285714 Arial,sans-serif;padding:0;background-color:#ffffff;border-radius:5px;'>" +
          "<div style='border:1px solid #cccccc;border-radius:5px;padding:20px;'>" +
            "<p style='margin-bottom:0;margin-top:0;'><%= relatedLink.message %></p>" +
          "</div>" +
        "</td>" +
      "</tr>" +
      "<tr><td style='padding-top: 10px;'></td></tr>" +
      "</tbody>" +
    "</table>" +
  "</td>";

exports.biuldLinks = function(baseUrl, relatedLinks) {
  var _ = require("underscore");

  var htmlMessages = _.foldl(relatedLinks, function(acc, relatedLink) {
    return _.template(itemTemplate, {acc: acc, baseUrl: baseUrl, relatedLink: relatedLink});
  }, "");

  return _.template(commonTemplate, htmlMessages);
};