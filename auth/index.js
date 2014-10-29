var passport = require('passport');

module.exports.set = function(app, users, hostname, secrets) {

    var twitter = require('./twitter.js');
    var facebook = require('./facebook.js');
    var google = require('./google.js');

    // Sets the auth/callback routes
    twitter.set(app, passport, secrets.twitter);
    facebook.set(app, passport, secrets.facebook);
    google.set(app, passport, hostname);


    passport.serializeUser(function(user, done) {
        done(null, {uid: user.uid, provider: user.provider});
    });

    passport.deserializeUser(function(user, done) {
        users.findOne({uid: user.uid, provider: user.provider}, function(err, user){
            done(null, user);
        });
    });

    // Auth callback functions call this to find/insert user
    app.findOrCreateUser = function (user, done) {
        users.findOne(user, function(err, existingUser) {
            if (existingUser) {
                done(null, existingUser);
            }
            else if(!err) {
                users.insert(user, function(err, newUser) {
                    done(null, newUser);
                });
            }
            else {
                console.error('Error occured while finding user...');
                console.error(JSON.stringify(err));
            }
        });
    };

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });
};
