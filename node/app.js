/**
 * Module dependencies.
 */

var express = require('express');
var partials = require('express-partials')
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var seed = require('seed-random');
var passport = require('passport')


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
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', routes.index);


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


passport.serializeUser(function(user, done) {
    done(null, {uid: user.uid, provider: user.provider});
});

passport.deserializeUser(function(user, done) {
    users.findOne({uid: user.uid, provider: user.provider}, function(err, user){
        done(null, user); 
    });
});



var TwitterStrategy = require('passport-twitter').Strategy;

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




// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/oauth_callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/oauth_callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);


var FacebookStrategy = require('passport-facebook').Strategy;

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

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


var GoogleStrategy = require('passport-google').Strategy;

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


app.get('/auth/google',
  passport.authenticate('google'));

app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://76.84.45.141');
  });


app.get('/api/GetDailySeed/:time', function(req, res){
    seed(req.params.time, {global: true});
    
    var r1 = Math.random().toFixed(10).substr(2);
    var r2 = Math.random().toFixed(10).substr(2);
    var r3 = Math.random().toFixed(10).substr(2);
    var r4 = Math.random().toFixed(10).substr(2);
    
    res.send(r1 + r2 + r3 + r4);
});

app.get('/api/GetAllGames', function(req, res){
    games.find({}).toArray(function(err, doc){
        res.send(doc);
    });
});

app.get('/api/Completed/:username/:score/:seed', function(req, res){

    var game = {
      Seed: req.params.seed,
      UserName: req.params.username
    };
    
    games.find(game).toArray(function(err, doc){
        
        // Check for duplicates
        if(doc.length === 0) {
            
            game.DatePlayed = new Date();
            game.Score = req.params.score;
            
            games.insert(game, function(err, doc){
                res.send(doc);
            });
        }
	else {
            console.log('duplicate game, not saving...');
            res.send('duplicate game');
	}
    });
   
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
