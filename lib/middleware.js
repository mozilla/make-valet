var url = require("url");

module.exports.errorHandler = function(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  res.status(err.status);
  res.render("error.html", err);
};

module.exports.fourOhFourHandler = function(req, res, next) {
  var err = {
    message: "You found a loose thread!",
    status: 404
  };

  res.status(err.status);
  res.render("error.html", err);
};

module.exports.noSubdomains = function(req, res, next) {
  if (req.subdomains.length) {
    return next("route");
  }

  next();
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
