/**
 * Module dependencies.
 */

var express = require('express');
var partials = require('express-partials');
var routes = require('./routes');
var api = require('./api');
var auth = require('./auth');
var http = require('http');
var path = require('path');
var seed = require('seed-random');



var app = express();


var mongodb = require('mongodb');

var games = {};
var users = {};
mongodb.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    games = db.collection('games');
    users = db.collection('users');
});




// all environments
app.use(partials());
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 365 * 24 * 60 * 60 * 1000}));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', routes.index);

auth.set(app, users);
api.set(app);

app.get('/api/GetDailySeed/:time', api.getDailySeed);
app.get('/api/GetAllGames', api.getAllGames);
app.get('/api/Completed/:username/:score/:seed', api.completed);









var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;


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




var findOrCreateUser = function (user, done) {
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
            console.error('Error occured while finding twitter user...');
            console.error(JSON.stringify(err));
        }
    });
};







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




http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
