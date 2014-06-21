
var express = require('express'),
    partials = require('express-partials'),
    routes = require('./routes'),
    api = require('./api'),
    auth = require('./auth'),
    config = require('./config'),
    secrets = require('./secrets'),
    http = require('http'),
    path = require('path'),
    mongodb = require('mongodb'),
    passport = require('passport');

var app = express();


// all environments
app.use(partials());
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(path.join(__dirname, 'public','img','favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 365 * 24 * 60 * 60 * 1000}));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(express.errorHandler());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', routes.index);


mongodb.connect(config.mongoip, function(err, db) {
    var users = db.collection('users'),
        games = db.collection('games');
    
    // Creates auth/api endpoints
    auth.set(app, users, config.hostname, secrets);
    api.set(app, games);
});


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
