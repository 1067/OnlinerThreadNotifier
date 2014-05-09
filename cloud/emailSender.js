var getEmailList = function(emails) {
  return require("underscore").foldl(emails, function(acc, item) {
    return acc + ", " + item;
  }, "");
};

exports.send = function(params) {
  console.log(params.html);

  var Mailgun = require('mailgun');
  var mailgunConf = params.mailgun;

  Mailgun.initialize(mailgunConf.appDomain, mailgunConf.appKey);

  var promise = new Parse.Promise();

  Mailgun.sendEmail({
    to: getEmailList(params.emails),
    from: "Mailgun@CloudCode.com",
    subject: "Thread updated on onliner's forum",
    html: params.html
  }, {
    success: function(httpResponse) {
      promise.resolve(httpResponse);
    },
    error: function(httpResponse) {
      promise.reject(httpResponse);
    }
  });

  return promise;
};