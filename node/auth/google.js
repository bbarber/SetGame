var GoogleStrategy = require('passport-google').Strategy;

module.exports.set = function(app, passport) {

    passport.use(new GoogleStrategy({
        returnURL: 'http://76.84.45.141/auth/google/return',
        realm: 'http://76.84.45.141/'
      },
      function(identifier, profile, done) {
        console.log(arguments);
        findOrCreateUser({
            uid: identifier,
            provider: 'google',
            username: profile.name.givenName
        }, done);
      }
    ));
    
    app.get('auth/twitter', passport.authenticate('google'));
    app.get('auth/google/return', passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://76.84.45.141');
      });
};