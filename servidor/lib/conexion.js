var mysql = require('mysql');

var connection = mysql.createConnection({
  host     :'localhost', 
  port     : '3306',
  user     : 'root',
  password : 'Ti89101084478*',
  database : 'competencias'
});

module.exports = connection;