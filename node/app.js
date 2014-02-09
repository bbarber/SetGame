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
var mongo = require('mongodb');
var monk = require('monk');
var passport = require('passport')

var db = monk(process.env.IP + ':27017/test');
var users = db.get('users');
var games = db.get('games');

var app = express();


// all environments
app.use(partials());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 23421113423}));
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
app.get('/users', user.list(db));

var TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
    console.log('Serializing user...');
    console.log('\t  User: ' + JSON.stringify(user));
    done(null, {uid: user.uid, provider: user.provider});
});

passport.deserializeUser(function(user, done) {
    console.log('Deserializing user...');
    console.log('\t  User: ' + JSON.stringify(user));
    users.findOne({uid: user.uid, provider: user.provider}, function(err, user){
        console.log('Found deserialized user...');
        console.log('\t  User: ' + JSON.stringify(user));
        done(null, user); 
    });
});

passport.use(new TwitterStrategy({
    consumerKey: 'ufDSp6R98HGuu8OInPzQQ',
    consumerSecret: 'DvINlmdcNFxgEkKPM2IR96wvABj8AEwTVV1hjJNEH4',
    callbackURL: "https://setgame-c9-branmantwo.c9.io/auth/twitter/oauth_callback"
},
function(token, tokenSecret, profile, done) {
    
    var twitterUser = {
        uid: profile.id, 
        provider: 'twitter', 
        username: profile.username
    };
    
    users.findOne(twitterUser, function(err, user) {
        
        if (user) {
            console.log('Existing twitter user found.');
            console.log('\t  User: ' + JSON.stringify(user));
            
            done(null, user);
        }
        else if(!err) {
            console.log('New twitter user. Inserting to users collection...');
            users.insert(twitterUser, function(err, user) {
                console.log('Inserted new twitter user...');
                console.log('\t Error: ' + JSON.stringify(err));
                console.log('\t  User: ' + JSON.stringify(user));
                
                done(null, user);
            });
        }
        else {
            console.log('Error occured while finding twitter user...');
            console.log('\t Error: ' + JSON.stringify(err));
        }
    });
}));



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


// app.get('/user', function(req, res){
//     res.send(req.user);
// });


app.get('/api/GetDailySeed/:time', function(req, res){
    seed(req.params.time, {global: true});
    
    var r1 = Math.random().toFixed(10).substr(2);
    var r2 = Math.random().toFixed(10).substr(2);
    var r3 = Math.random().toFixed(10).substr(2);
    var r4 = Math.random().toFixed(10).substr(2);
    
    res.send(r1 + r2 + r3 + r4);
});

app.get('/api/GetAllGames', function(req, res){
    games.find({}, function(err, doc){
        res.send(doc);
    });
});

app.get('/api/Completed/:username/:score/:seed', function(req, res){

    var game = {
      Seed: req.params.seed,
      UserName: req.params.username
    };
    
    games.find(game, function(err, doc){
        
        // Check for duplicates
        if(doc.length === 0) {
            
            game.DatePlayed = new Date();
            game.Score = req.params.score;
            
            games.insert(game, function(err, doc){
                console.log('Game save...');
                console.log('\t Error: ' + JSON.stringify(err));
                console.log('\t  Game: ' + JSON.stringify(doc));
            });
        }
    });
   
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
