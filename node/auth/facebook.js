var FacebookStrategy = require('passport-facebook').Strategy;

module.exports.set = function(app, passport) {    
    
    passport.use(new FacebookStrategy({
        clientID: '1449238911976358',
        clientSecret: '5b9bcfffaa9ccfa7a1b82008096fb187',
        callbackURL: "/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        findOrCreateUser({
            uid: profile.id,
            provider: 'facebook',
            username: profile.username
        }, done);
      }
    ));
    
    app.get('auth/facebook', passport.authenticate('facebook'));
    app.get('auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      }));
};