/* ****************************************************************************************** */
/* **********  Should be the model for the 3things project, to be implemented  ************** */
/* ****************************************************************************************** */
var db = require('./db');
db.connect('localhost', '3things', 'to_be_decided', '3things');

exports.test = function(callback){
	db.query("SELECT * FROM users", [], callback);
};