var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "endless_dungeon",
	multipleStatements: true
});

connection.connect(function (err){
    if (err) throw err;
    console.log("Le serveur s'est bien connecté sur la base de donnée MYSQL")
});


var authentification = require('./routes/authentification.js');
let auth = new authentification(connection);
app.use('/authentification', auth.routes);



//Toujours mettre a la fin pour les routes non definies
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

app.post('*', function(req, res){
	res.send('Sorry, this is an invalid URL.');
 });

app.listen(3000);