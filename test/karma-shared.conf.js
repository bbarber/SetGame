module.exports = function() {
  return {
    basePath: '../',
    frameworks: ['mocha'],
    reporters: ['progress'],
    browsers: ['Firefox', 'Chrome', 'Safari', 'PhantomJS'],
    autoWatch: true,

    // these are default values anyway
    singleRun: false,
    colors: true,

    files : [
      //3rd Party Code
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/socket.io-client/socket.io.js',

      //App-specific Code
      'public/js/app.js',
      'public/js/services/*.js',
      'public/js/directives/*.js',
      'public/js/filters/*.js',
      'public/js/services/*.js',
      'public/js/constants/*.js',

       //Test-Specific Code
      'node_modules/chai/chai.js',
      'test/lib/chai.js',

      //extra testing code
      'bower_components/angular-mocks/angular-mocks.js',

      //mocha stuff
      'test/mocha.conf.js'
    ]
  }
};
