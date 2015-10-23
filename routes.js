var http = require("http"),
    i18n = require("webmaker-i18n"),
    path = require("path"),
    template = require("url-template"),
    version = require("./package").version,
    wts = require("webmaker-translation-stats");

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

    var contentType = proxyRes.headers["content-type"];
    if (contentType && contentType !== "binary/octet-stream") {
      res.type(contentType);
    } else {
      res.type("text/html; charset=UTF-8");
    }

    proxyRes.on("error", function(err) {
      next(err);
    });

    proxyRes.pipe(res);
  }).on("error", function(err) {
    next(err);
  });
};
