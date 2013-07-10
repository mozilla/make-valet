// New Relic Server monitoring support
if ( process.env.NEW_RELIC_ENABLED ) {
  require( "newrelic" );
}

var configVerify = require("./lib/configverify"),
    express = require("express"),
    Habitat = require("habitat"),
    middleware = require("./lib/middleware"),
    routes = require("./routes"),
    slashes = require("connect-slashes");

Habitat.load();

var app = express(),
    configErrors,
    env = new Habitat();

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

app.use(express.logger());
app.use(express.compress());
// Redirect paths with trailing slashes to paths w/o trailing slashes
app.use(slashes(false));
app.use(app.router);
app.use(middleware.errorHandler);
app.use(middleware.fourOhFourHandler);

app.get(
  "/healthcheck",
  middleware.noSubdomains,
  routes.healthCheck
);

app.get(
  "*",
  middleware.proxyPathPrepare(env.get("STATIC_DATA_STORE")),
  routes.proxyHandler
);

app.listen(env.get("PORT"), function() {
  console.log("make-valet now listening on http://localhost:%d", env.get("PORT"));
});
