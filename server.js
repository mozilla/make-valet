// New Relic Server monitoring support
if ( process.env.NEW_RELIC_ENABLED ) {
  require( "newrelic" );
}

var configVerify = require("./lib/configverify"),
    express = require("express"),
    Habitat = require("habitat"),
    lessMiddleware = require("less-middleware"),
    Makeapi = require("makeapi-client"),
    middleware = require("./lib/middleware"),
    nunjucks = require("nunjucks"),
    path = require("path"),
    routes = require("./routes"),
    slashes = require("connect-slashes");

Habitat.load();

var app = express(),
    configErrors,
    env = new Habitat(),
    makeAPIClient = new Makeapi({
      apiURL: env.get("MAKE_ENDPOINT")
    }),
    nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.join( __dirname, 'views' )), {
      autoescape: true
    }),
    optimizeCSS = env.get("OPTIMIZE_CSS"),
    tmpDir = path.join(require("os").tmpDir(), "make-valet");

configErrors = configVerify(env.all());
if (configErrors.length) {
  console.log("You need to fix the following configuration errors:");
  configErrors.forEach(function(error) {
    console.log("* %s", error);
  });
  console.log("Look at the README or env.dist for configuration options");
  process.exit(1);
  return;
}

app.disable("x-powered-by");
app.enable("trust proxy");
app.locals({
  WEBMAKERORG: env.get("WEBMAKERORG")
});
nunjucksEnv.express( app );

app.use(express.favicon("public/static/images/favicon.ico", {
  maxAge: 31556952000
}));
app.use(express.logger());
app.use(express.compress());
// Redirect paths with trailing slashes to paths w/o trailing slashes
app.use(slashes(false));
app.use(lessMiddleware({
  once: optimizeCSS,
  dest: tmpDir,
  src: path.join(__dirname, "public"),
  compress: optimizeCSS,
  yuicompress: optimizeCSS,
  optimization: optimizeCSS ? 0 : 2
}));
app.use(express.static(tmpDir, {
  maxAge: "31556952000" // one year
}));
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "31556952000" // one year
}));
app.use("/static/bower", express.static(path.join(__dirname, "bower_components"), {
  maxAge: "31556952000" // one year
}));
app.use(middleware.setVanityURL);
app.use(app.router);
app.use(middleware.errorHandler);
app.use(middleware.fourOhFourHandler);

app.get(
  "/healthcheck",
  middleware.noSubdomains,
  routes.healthCheck
);

app.get(
  /.*(_|remix|edit)$/,
  middleware.proxyPathPrepare(env.get("STATIC_DATA_STORE")),
  routes.proxyHandler
);

app.get(
  /.*[^_]$/,
  middleware.loadMakeDetails(makeAPIClient),
  routes.embedShellHandler,
  middleware.proxyPathPrepare(env.get("STATIC_DATA_STORE")),
  routes.proxyHandler
);

app.listen(env.get("PORT"), function() {
  console.log("make-valet now listening on http://localhost:%d", env.get("PORT"));
});
