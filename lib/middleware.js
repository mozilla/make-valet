var hood = require("hood"),
    http = require("http"),
    url = require("url"),
    utils = require("./utils");

module.exports.addCSP = function(options) {
  return hood.csp({
    headers: [
      "Content-Security-Policy"
    ],
    policy: {
      'default-src': ["'self'"],
      'frame-src': ["'self'", options.detailsHost, options.profileHost],
      'img-src': ["'self'", "https://ssl.google-analytics.com", "http://www.google-analytics.com"],
      'script-src': ["'self'", "https://ssl.google-analytics.com"],
      'style-src': ["'self'", "'unsafe-inline'"]
    }
  });
};

module.exports.errorHandler = function(err, req, res, next) {
  if (typeof err === "string") {
    console.error("You're passing a string into next(). Go fix this: %s", err);
  }

  var error = {
    message: err.toString(),
    status: http.STATUS_CODES[err.status] ? err.status : 500
  };

  res.status(error.status);
  res.render("error.html", error);
};

module.exports.fourOhFourHandler = function(req, res, next) {
  var err = {
    message: req.gettext("You found a loose thread!"),
    status: 404
  };

  res.status(err.status);
  res.render("error.html", err);
};

module.exports.setVanityURL = function(req, res, next) {
  res.locals.vanityURL = utils.getUrl(req);
  next();
};

module.exports.loadMakeDetails = function(makeClient) {
  return function(req, res, next) {
    makeClient.url(utils.getUrl(req))
      .then(function(err, makes, total) {
        if (err) {
          return next(err);
        }

        if (!makes.length) {
          return next("route");
        }

        res.locals.make = makes[0];
        next();
      });
  };
};

module.exports.proxyPathPrepare = function(staticDataStore) {
  return function(req, res, next) {
    var subdomain = req.subdomains[0];

    if (!subdomain) {
      return next("route");
    }
    res.locals.proxyPath = url.resolve(staticDataStore, subdomain + req.path);
    next();
  }
};

module.exports.removeCSP = function(req, res, next) {
  res.removeHeader("Content-Security-Policy");

  process.nextTick(function() {
    next();
  });
};

module.exports.rootRedirect = function rootRedirect(req, res, next) {
  if (req.subdomains.length !== 1) {
    return res.redirect(307, "https://webmaker.org");
  }

  next();
};
