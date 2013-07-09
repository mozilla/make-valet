var http = require("http"),
    ignoreHTTPStatus = [
      404
    ];

module.exports.httpError = function(code, msg) {
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;

  // Do not send some HTTP errors to New Relic
  if (ignoreHTTPStatus.indexOf(code) != -1) {
    err.__NR_CAUGHT = true;
  }

  return err;
};
