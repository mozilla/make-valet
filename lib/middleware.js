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
      'frame-src': ["'self'", options.detailsHost],
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

module.exports.setUsername = function(req, res, next) {
  // Subdomains are added in reverse dns order
  // So a.b.example.org will return ['b', 'a']
  var username = req.subdomains.pop();

  res.locals.username = username;
  process.nextTick(next);
};

module.exports.proxyPathPrepare = function(staticDataStore) {
  return function(req, res, next) {
    if (!res.locals.username) {
      return next("route");
    }

    res.locals.proxyPath = url.resolve(staticDataStore, res.locals.username + req.path);
    process.nextTick(next);
  }
};

module.exports.removeCSP = function(req, res, next) {
  res.removeHeader("Content-Security-Policy");

  process.nextTick(next);
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
  if (origins) {
    if (origins === "*") {
      return function(req, res, next) {
        res.header( "Access-Control-Allow-Origin", origins );
        next();
      };
    }

    origins = origins.split(" ");
    return function(req, res, next) {
      var origin = req.get('origin');
      if (origins.indexOf(origin) !== -1) {
        res.header("Access-Control-Allow-Origin", origin);
      }
      next();
    };
  }
  return function(req, res, next) {
    next();
  };
};
