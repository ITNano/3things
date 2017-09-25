var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser');
app.use(cookieParser('keyboard cat'));
var flash = require('express-flash'), session = require('express-session');
app.use(session({ resave: false, saveUninitialized: false, secret:'herp derp tjoho' }));
app.use(flash());

app.use(express.static('public'));
app.set('view engine', 'ejs');

var model = require('./model');

app.get('/', function(req, res, next){
	res.redirect('/form');
});

app.get('/form', function(req, res, next){
	res.send('This page is coming! Check it out.... soon on an internet near you!');
});

app.get('/emelie', function(req, res, next){
	res.send('Eh, not really implemented yet');
});

app.get('/test', function(req, res, next){
	model.test(function(result){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(result));
	});
});

server.listen(1776, function(){
	console.log('Server started. Port 1776');
});