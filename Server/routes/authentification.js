var express = require('express');
var authent = express.Router();
var bodyParser = require('body-parser');

authent.use(bodyParser.json()); 
authent.use(bodyParser.urlencoded({ extended: true }));

module.exports = class Authentification {
    constructor(db = null) {
        this.db = db;
        this.initRoutes();
    }

    get routes() { return authent; }

    initRoutes() {

        authent.post('/signup', function(req, res) {
            console.log(this);
            console.log(req.body);
            let params = req.body;
            if (!params.email || !params.password){
                res.status("400");
                res.send("Invalid details!");
                return;
            }

            let payload = {
                email: params.email,
                password: params.password
            }
            console.log(this.db);
            var sqlInsert = "INSERT INTO logs SET ?";
            this.db.query(sqlInsert, payload, function(err, res) {
                if(err) throw err;
                        console.log("Compte crée avec succès!");
            });
        });
    }
};