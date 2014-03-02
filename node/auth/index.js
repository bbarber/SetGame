var passport = require('passport');

model.exports.set = function(app, users) {

    var twitter = require('./twitter.js');
    var facebook = require('./facebook.js');
    var google = require('./google.js');
    
    // Sets the auth/callback routes
    twitter.set(app, passport);
    facebook.set(app, passport);
    google.set(app, passport);
    
    
    passport.serializeUser(function(user, done) {
        done(null, {uid: user.uid, provider: user.provider});
    });

    passport.deserializeUser(function(user, done) {
        users.findOne({uid: user.uid, provider: user.provider}, function(err, user){
            done(null, user); 
        });
    });
    
    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });
};