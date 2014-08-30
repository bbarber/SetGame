var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  //override the browser for travis/command line
  conf.browsers = ['PhantomJS'];

  conf.files = conf.files.concat([
    //test files
    './test/unit/**/*.js',
    './test/e2e/**/*.js'
  ]);

  config.set(conf);
};
