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

app.use(function(req, res, next){
	res.locals.get = function(param, defaultVal) {
		return typeof param !== 'undefined' ? param : (typeof defaultVal !== 'undefined' ? defaultVal : '');
	};
	
	res.locals.ifExists = function(param, onExist, onNotExist){
		return res.locals.get(param) ? onExist : onNotExist;
	};
	
	res.locals.ifValue = function(param, onTrue, onFalse){
		return param ? onTrue : onFalse;
	};
	next();
});

var model = require('./model'), util = require('./util');

app.get('/', function(req, res, next){
	res.redirect('/form');
});

app.get('/form', function(req, res, next){
	res.render('form', {});
});

app.post('/form', function(req, res, next){
	model.registerSecret(req.body.name, req.body.secret, function(result){
		var positiveResponses = ["Wohoo, your secret was added!", "We haz your secret!", "Phew, the submission code still works!", "And that's it, now I haz that secret!"];
		req.flash('info', result.error ? 'Oh no! Something went wrong. Try again maybe?' : util.randomEntry(positiveResponses));
		if(result.error){
			req.flash('error', true);
		}else{
			req.flash('name', result.name);
			req.flash('submissions', result.secrets);
		}
		res.redirect('/form');
	});
});

app.post('/nbrofsecrets', function(req, res, next){
	model.getNumberOfSecrets(req.body.name, function(result){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(result));
	});
});

app.get('/emelie', function(req, res, next){
	model.getSecrets('lämna tomt', function(result){
		res.render('admin', {users: result});
	});
});

app.post('/setround', function(req, res, next){
	model.setRound(req.body.secrets, function(result){
		res.send(result.error ? 'There was an error creating the round' : 'Yay, the round was created');
	});
});

app.get('/rounds', function(req, res, next){
	model.getPrettyRounds(function(result){
		res.send(result.error ? 'A problem occured while exporting the data' : result.data);
	});
});

app.get('/reset', function(req, res, next){
	model.resetRounds();
	res.redirect('/emelie');
});


server.listen(1776, function(){
	console.log('Server started. Port 1776');
});