/************** DOCS **********************
**	Simple database wrapper in order to	 **
**	make life easier when applying a db	 **
**	query.							   	 **
******************************************/ 

var mysql = require('mysql');
var connection;
var dbParams;

exports.connect = function(host, user, pw, db, callback){
	dbParams = {host: host, user: user, password: pw, database: db, multipleStatements: true};
	doConnect(callback);
}

/* If a function object is supplied as the options param, this
   will be considered to be the options.onSuccess parameter  */
exports.query = function(query, data, options){
	if(typeof options === "function"){
		options = {onSuccess : options};
	}
	
	if(options && options.replaceEmpty){
		for(var i = 0; i<data.length; i++){
			if(typeof data[i] === "undefined"){
				data[i] = 0;
			}else if(data[i] == "NULL"){
				data[i] = undefined;
			}
		}
	}
	
	connection.query(query, data, function(error, results, fields){
		if(error){
			if(options && options.onError){
				options.onError(error);
			}else{
				console.log('oops, error!');
				console.log(error);
			}
		}else{
			if(options && options.onSuccess){
				options.onSuccess(results);
			}
		}
	});
}

exports.disconnect = function(){
	connection.end();
}

/* Thanks to cloudymarble @ https://stackoverflow.com/a/20211143 */
function doConnect(callback){
	connection = mysql.createConnection(dbParams);
	connection.connect(function(err){
		if(err){
			console.log("Could not connect to database, retrying soon...");
			setTimeout(doConnect, 5000);
		}else{
			console.log("Connected to the database");
			if(callback){
				callback();
			}
		}
	});
	connection.on('error', function(err){
		if(err.code == "PROTOCOL_CONNECTION_LOST"){
			doConnect();
		}else{
			console.log("Got a database error: ", err);
			throw err;
		}
	});
}