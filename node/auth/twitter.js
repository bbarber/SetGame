var TwitterStrategy = require('passport-twitter').Strategy;

module.exports.set = function(app, passport) {  
  
    passport.use(new TwitterStrategy({
        consumerKey: 'ufDSp6R98HGuu8OInPzQQ',
        consumerSecret: 'DvINlmdcNFxgEkKPM2IR96wvABj8AEwTVV1hjJNEH4',
        callbackURL: "/auth/twitter/oauth_callback"
    },
    function(token, tokenSecret, profile, done) {
        findOrCreateUser({
            uid: profile.id,
            provider: 'twitter',
            username: profile.username
        }, done);
    }));

    
    app.get('auth/twitter', passport.authenticate('twitter'));
    app.get('auth/twitter/oauth_callback', passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    
};

