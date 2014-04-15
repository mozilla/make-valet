var http = require("http"),
    version = require("./package").version,
    wts = require("webmaker-translation-stats"),
    i18n = require("webmaker-i18n"),
    path = require("path");

module.exports.analytics = function(req, res, next) {
  res.type("text/javascript; charset=utf-8");
  res.render("googleanalytics.js");
};

module.exports.embedShellHandler = function(req, res, next) {
  if (res.locals.make.contentType == "application/x-x-ray-goggles") {
    return next();
  }

  res.render("embed-shell.html");
};

module.exports.healthCheck = function(req, res, next) {
  var healthcheckObject = {
    http: "okay",
    version: version
  };
  wts(i18n.getSupportLanguages(), path.join(__dirname, "locale"), function(err, data) {
    if(err) {
      healthcheckObject.locales = err.toString();
    } else {
      healthcheckObject.locales = data;
    }
    res.json(healthcheckObject);
  });
};

module.exports.proxyHandler = function(req, res, next) {
  var proxyReq = http.get(res.locals.proxyPath, function(proxyRes) {
    if (proxyRes.statusCode != 200) {
      proxyReq.abort();
      return next("route");
    }

    // Send content-type stored on S3
    res.type("text/html; charset=UTF-8");

    proxyRes.on("error", function(err) {
      next(err);
    });

    proxyRes.pipe(res);
  }).on("error", function(err) {
    next(err);
  });
};

module.exports.userProfileService = function(req, res, next) {
  res.render("profile-shell.html", {
    username: req.subdomains.pop()
  });
};
