var express = require('express');
var authent = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
let tools = new toolsModule();
var validator = require("email-validator");

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
            let params = req.body;
            if (!params.email || !params.password || !validator.validate(params.email)) {
                res.status(400).json(
                    {'code' : '400',
                    'succes' : 'false',
                    'error' : 'Wrong informations'});
                    return;
            } else if (!params.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
                res.status(400).json(
                    {'code' : '400',
                    'succes' : 'false',
                    'error' : 'Wrong Password'});
                    return;
            }

            let payload = {
                email: params.email,
                password: tools.encryptString(params.password),
                created_on: tools.getDateNowForMysql()
            }

            this.db.insert("logs", payload, function(isCreated) {
                if (isCreated["succes"]) {
                    res.status(200).json(
                        {'code' : '200',
                        'succes' : 'true',});    
                } else {
                    console.log(isCreated["msg"]);
                    if (isCreated["msg"]["code"] == "ER_DUP_ENTRY") {
                        res.status(400).json(
                            {'code' : '400',
                            'succes' : 'false',
                            'error' : 'Email already exist'});
                    } else {
                        res.status(400).json(
                            {'code' : '400',
                            'succes' : 'false',
                            'error' : 'Inconnue'});
                    }
                }
            });
        }.bind(this));

        authent.post('/signin', function(req, res) {
            
        }.bind(this));
    }
};