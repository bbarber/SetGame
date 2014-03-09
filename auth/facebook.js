var FacebookStrategy = require('passport-facebook').Strategy;

module.exports.set = function(app, passport, secret) {   
    
    passport.use(new FacebookStrategy({
        clientID: secret.clientID,
        clientSecret: secret.clientSecret,
        callbackURL: "/auth/facebook/callback"
    },
        function(accessToken, refreshToken, profile, done) {
            passport.findOrCreateUser({
                uid: profile.id,
                provider: 'facebook',
                username: profile.username
        }, done);
      }
    ));
    
    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
    });
};