var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var database = require('./modules/Database');
let db = new database();

var Authentification = require('./routes/Authentification');
let auth = new Authentification(db);
app.use('/authentification', auth.routes);

var Home = require('./routes/Home');
let home = new Home(db);
app.use('/home', home.routes);

var Editor = require('./routes/Editor');
let editor = new Editor(db);
app.use('/editor', editor.routes);

var CharacterRoutes = require('./routes/CharacterRoutes');
let characterRoutes = new CharacterRoutes(db);
app.use('/character', characterRoutes.routes);

//Toujours mettre a la fin pour les routes non definies
app.get('*', function(req, res){
   res.send('Sorry, this is an invalid URL.');
});

app.post('*', function(req, res){
	res.send('Sorry, this is an invalid URL.');
 });

app.listen(3000);