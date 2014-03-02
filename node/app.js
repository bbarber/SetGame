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
var mongodb = require('mongodb');


var app = express();


mongodb.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    var users = db.collection('users');
    var games = db.collection('games');
    
    // Creates auth/api endpoints
    auth.set(app, users);
    api.set(app, games);
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
app.use(app.router);

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}


app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
