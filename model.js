/* ****************************************************************************************** */
/* **********  Should be the model for the 3things project, to be implemented  ************** */
/* ****************************************************************************************** */
var db = require('./db'), util = require('./util');
db.connect('localhost', '3things', 'to_be_decided', '3things');
var occasion = 1;
var roundSize = 3;


exports.registerSecret = function(name, secret, callback){
	db.query("INSERT INTO secrets (user_id, secret) VALUES (getUserId(?), ?)", [name, secret], function(result){
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

exports.getSecrets = function(pw, callback){
	if(pw == 'lämna tomt'){
		db.query("SELECT U.name AS name, S.id AS secretId, S.secret AS secret, count(R.id) AS used FROM secrets S LEFT JOIN users U ON U.id = S.user_id LEFT JOIN rounds R ON R.secret_id = S.id GROUP BY S.id ORDER BY U.name ASC", [], function(result){
			var res = [];
			var currentUser = '';
			for(var i = 0; i<result.length; i++){
				if(result[i].name != currentUser){
					currentUser = result[i].name;
					res.push({name: result[i].name, secrets: []});
				}
				res[res.length-1].secrets.push({id: result[i].secretId, text: result[i].secret, used: result[i].used>0});
			}
			
			callback(res);
		});
	}else{
		callback({error: true});
	}
};

exports.setRound = function(secretIds, callback){
	if(secretIds.length == roundSize){
		db.query("INSERT INTO rounds (occasion_id, round, secret_id) VALUES (?, @roundnum := getNewRound(), ?), (?, @roundnum, ?), (?, @roundnum, ?)", [occasion, secretIds[0], occasion, secretIds[1], occasion, secretIds[2]], callback);
	}else{
		callback({error: true});
	}
};

exports.getPrettyRounds = function(callback){
	db.query("SELECT R.round AS round, S.secret AS secret, U.name AS name FROM rounds R LEFT JOIN secrets S on R.secret_id = S.id LEFT JOIN users U ON S.user_id = U.id WHERE R.occasion_id = ? ORDER BY R.round ASC, S.secret ASC", [occasion], function(result){
		if(result.error){
			callback({error:true});
		}else{
			var output = "";
			var roundNumber = 1;
			for(var i = 0; i<result.length; i += roundSize){
				var round = result.slice(i, i+roundSize);
				output += "Runda "+roundNumber+": "+util.shuffleArray(round.map(function(el){return el.name;})).join(', ')+"\n";
				output += round.map(function(el, index){return (index+1)+". "+el.secret;}).join("\n")+"\n\n";
				output += "Facit (Runda "+roundNumber+"): "+round.map(function(el, index){return (index+1)+". "+el.name;}).join(", ")+"\n\n\n";
				roundNumber++;
			}
			callback({data: output});
		}
	});
};

exports.resetRounds = function(){
	db.query("DELETE FROM rounds");
};