var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./modules/Database.js');
let db = new database();


var authentification = require('./routes/Authentification.js');
let auth = new authentification(db);
app.use('/authentification', auth.routes);



//Toujours mettre a la fin pour les routes non definies
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

app.post('*', function(req, res){
	res.send('Sorry, this is an invalid URL.');
 });

app.listen(3000);