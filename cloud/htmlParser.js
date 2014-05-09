exports.getLinks = function(html) {
  var regexAnchaors = /<a.*?href="#p.*?".*?>#<\/a>/g;
  var regexLink = /href.*?=.*?[',"]#.*?[',"]/g;
  
  return require("underscore").map(html.match(regexAnchaors), function(item) {
    var href = item.match(regexLink)[0];
    return href.substring(6, href.length - 1);
  });
};