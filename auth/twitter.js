var TwitterStrategy = require('passport-twitter').Strategy;

module.exports.set = function(app, passport, secret) {  
  
    passport.use(new TwitterStrategy({
        consumerKey: secret.consumerKey,
        consumerSecret: secret.consumerSecret,
        callbackURL: "/auth/twitter/oauth_callback"
    },
    function(token, tokenSecret, profile, done) {
        app.findOrCreateUser({
            uid: profile.id,
            provider: 'twitter',
            username: profile.username
        }, done);
    }));

    
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/oauth_callback', passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    
};

