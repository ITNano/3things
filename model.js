/* ****************************************************************************************** */
/* **********  Should be the model for the 3things project, to be implemented  ************** */
/* ****************************************************************************************** */
var db = require('./db');
db.connect('localhost', '3things', 'to_be_decided', '3things');


exports.registerSecret = function(name, secret, callback){
	db.query("INSERT INTO secrets (occasion_id, user_id, secret) VALUES (1, getUserId(?), ?)", [name, secret], function(result){
		if(result.affectedRows == 0){
			result.error = true;
			if(callback){
				callback({error: true});
			}
		}
		
		exports.getNumberOfSecrets(name, callback);
	});
};

exports.getNumberOfSecrets = function(name, callback){
	if(name){
		db.query("SELECT count(id) AS count FROM secrets WHERE user_id = getUserId(?)", [name], function(result){
			if(callback){
				callback(result.error ? {error: true} : {name: name, secrets: result[0].count});
			}
		});
	}else{
		callback({secrets: 0});
	}
};