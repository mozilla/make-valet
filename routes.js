var http = require("http"),
    version = require("./package").version;

module.exports.embedShellHandler = function(req, res, next) {
  res.render("embed-shell.html");
};

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
      return next("route");
    }

    // Send content-type stored on S3
    res.type(proxyRes.headers["content-type"]);

    proxyRes.on("error", function(err) {
      next(err);
    });

    proxyRes.pipe(res);
  }).on("error", function(err) {
    next(err);
  });
};
