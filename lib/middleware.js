var utils = require("./utils");

module.exports.errorHandler = function(err, req, res, next) {
  if (!err.status) {
    err.status = 500;
  }

  res.send(err.status);
};

module.exports.fourOhFourHandler = function(req, res, next) {
  res.send(404);
};

module.exports.proxyPathPrepare = function(staticDataStore) {
  return function(req, res, next) {
    var subdomain = req.subdomains[0];

    if (!subdomain) {
      return next(utils.httpError(404));
    }

    res.locals.proxyPath = staticDataStore + "/" + subdomain + req.path;
    next();
  }
};
