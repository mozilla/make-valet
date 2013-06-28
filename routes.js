var http = require("http"),
    utils = require("./lib/utils");

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
}
