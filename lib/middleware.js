var hood = require("hood"),
    http = require("http"),
    url = require("url"),
    utils = require("./utils");

module.exports.addCSP = function(options) {
  var policy = {
    headers: [
      "Content-Security-Policy"
    ],
    policy: {
      'connect-src': ["http://*.log.optimizely.com", "https://*.log.optimizely.com"],
      'default-src': ["'self'"],
      'frame-src': ["'self'", options.detailsHost, options.profileHost],
      'img-src': ["'self'", "https://ssl.google-analytics.com", "http://www.google-analytics.com", "http://*.log.optimizely.com", "https://*.log.optimizely.com"],
      'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'", "https://ssl.google-analytics.com", "https://*.newrelic.com", "http://*.newrelic.com", "https://cdn.optimizely.com"],
      'style-src': ["'self'", "'unsafe-inline'"]
    }
  };

  if (options.reportToHost) {
    policy.policy['report-uri'] = [options.reportToHost];
  }

  return hood.csp(policy);
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
    // Subdomains are added in reverse dns order
    // So a.b.example.org will return ['b', 'a']
    var username = req.subdomains.pop();

    if (!username) {
      return next("route");
    }
    res.locals.proxyPath = url.resolve(staticDataStore, username + req.path);
    next();
  }
};

module.exports.removeCSP = function(req, res, next) {
  res.removeHeader("Content-Security-Policy");

  process.nextTick(function() {
    next();
  });
};

module.exports.makeRedirect = function(makeClient) {
  var stripPathRegex =  /(.*)(\/edit.*$|\/remix.*$)/;
  return function makeRedirect(req, res, next) {
    var splitUrl = stripPathRegex.exec(utils.getUrl(req)),
        requestUrl = splitUrl[0],
        makeUrl = splitUrl[1],
        key = splitUrl[2].substring(1) + "url",
        make;

    makeClient.url(makeUrl)
    .then(function(err, makes, total) {
      if (err) {
        return next(err);
      }
      if (!makes.length) {
        return next();
      }
      make = makes[0];
      if (!make[key] || requestUrl === make[key]) {
        return next();
      }
      res.redirect(make[key])
    });
  };
};

module.exports.addCORS = function( origins ) {
  if ( origins ) {
    return function(req, res, next) {
      res.header( "Access-Control-Allow-Origin", origins );
      next();
    };
  }
  return function(req, res, next) {
    next();
  };
};
