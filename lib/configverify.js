var requiredOptions = [
  "PORT",
  "STATIC_DATA_STORE"
];

module.exports = function(config) {
  var errors = [];

  requiredOptions.forEach(function(option) {
    if (!config[option]) {
      errors.push("`" + option + "` is not defined");
    }
  });

  return errors;
};
