var http = require("http"),
    utils = require("./lib/utils"),
    version = require("./package").version;

module.exports.healthCheck = function(req, res, next) {
  res.json({
    http: "okay",
    version: version
  });
};

module.exports.proxyHandler = function(req, res, next) {
  var proxyReq = http.get(res.locals.proxyPath, function(proxyRes) {
    if (proxyRes.statusCode != 200) {
      proxyReq.abort();
      return next(utils.httpError(proxyRes.statusCode));
    }

    proxyRes.pipe(res);
  }).on("error", function(err) {
    next(err);
  });
};
