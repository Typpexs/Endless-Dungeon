var express = require('express');
var authent = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
let tools = new toolsModule();
var validator = require("email-validator");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
const util = require('util');

authent.use(bodyParser.json());
authent.use(bodyParser.urlencoded({ extended: true }));

module.exports = class Authentification {
    constructor(db = null) {
        this.db = db;
        this.initRoutes();
    }

    get routes() { return authent; }

    initRoutes() {

        authent.post('/signup', multipartMiddleware, function(req, res) {
            let params = req.body;
            if (!params.email || !params.password || !validator.validate(params.email)) {
                res.status(400).json(
                    {'success' : 'false',
                    'error' : 'Wrong informations'});
                    return;
            } else if (!params.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
                res.status(400).json(
                    {'success' : 'false',
                    'error' : 'Wrong Password'});
                    return;
            }

            let payload = {
                email: params.email,
                password: tools.encryptString(params.password),
                created_on: tools.getDateNowForMysql()
            }

            this.db.insert("logs", payload, function(isCreated) {
                if (isCreated["success"]) {
                    let payloadGetId = { email: params.email }
                    this.db.getIdWithMail(payloadGetId, function(isIdGet) {
                        if (isIdGet["success"]) {
                            let payloadUser = {
                                id_logs: isIdGet.id,
                                pseudo: "User"+isIdGet.id
                            }
                            this.db.insert("user", payloadUser, function(isUserCreated) {
                                if (isUserCreated.success) {
                                    res.status(200).json({
                                        'success': 'true'
                                    });
                                } else {
                                    res.status(400).json(
                                        {'success' : 'false',
                                        'error' : 'Create user failed'});                                                                
                                }
                            });
                        } else {
                            res.status(400).json(
                                {'success' : 'false',
                                'error' : 'Create user failed'});                            
                        }
                    }.bind(this));
                } else {
                    if (isCreated["msg"]["code"] == "ER_DUP_ENTRY") {
                        res.status(400).json(
                            {'success' : 'false',
                            'error' : 'Email already exist'});
                    } else {
                        res.status(400).json(
                            {'success' : 'false',
                            'error' : 'Inconnue'});
                    }
                }   
            }.bind(this));
        }.bind(this));

        authent.post('/signin', multipartMiddleware, function(req, res) {
            let params = req.body;
            let payload = {
                email: params.email,
                password: params.password
            }
            this.db.checkLogin(payload, function(userData) {
                if (userData.success) {
                    let payloadId = {
                        id_logs: userData.id
                    }
                    this.db.getDataOneColumn("id", "user", payloadId, function(userId) {
                        if (userId.success) {
                            res.status(200).json(
                                {'success': 'true',
                                'token': tools.generateTokenForUser(userId.result)
                                });
                        } else {
                            res.status(400).json(
                                {'success': 'false',
                                'error': userId["msg"]
                                });
                        }
                    });

                } else {
                    res.status(400).json(
                        {'success': 'false',
                        'error': userData["msg"]
                        });
                }
            }.bind(this));
        }.bind(this));
    }
};