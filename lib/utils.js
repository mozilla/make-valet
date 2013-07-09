var http = require("http");

module.exports.httpError = function(code, msg) {
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;
  return err;
};
