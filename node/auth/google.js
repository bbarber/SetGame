var GoogleStrategy = require('passport-google').Strategy;


module.exports.set = function(app, passport, hostname) {

    passport.use(new GoogleStrategy({
        returnURL: hostname + 'auth/google/return',
        realm: hostname
      },
      function(identifier, profile, done) {
        passport.findOrCreateUser({
            uid: identifier,
            provider: 'google',
            username: profile.name.givenName
        }, done);
      }
    ));
    
    app.get('/auth/google', passport.authenticate('google'));
    app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect(hostname);
      });
};