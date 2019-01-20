var express = require('express');
var home = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
let tools = new toolsModule();
var characterModule = require('../modules/Character');

home.use(bodyParser.json());
home.use(bodyParser.urlencoded({ extended: true }));

module.exports = class Home {
    constructor(db = null) {
        this.db = db;
        this.levelUser = 1;
        this.initRoutes();
    }

    get routes() { return home; }

    initRoutes() {
        home.get('/', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            let columnArray = ["*"];
            let tableArray = ["user", "user_resource"];
            let onArray = ["user.id=user_resource.id_user"];

            let payload = {
                "user.id": userId
            }

            this.db.getDataWithJoin(columnArray, tableArray, onArray, 0, payload, function(data) {
                if (data.success) {
                    console.log(data);
                    res.status(200).json({
                        'success': 'true',
                        'result': data
                    });
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': data.msg
                    });
                }
            });

            
        }.bind(this));

        home.get('/tavern', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
            let payload = {
                id: userId
            }
            this.db.getDataOneColumn("level", "user", payload, function(levelGet) {
                if (levelGet.success) {
                    this.levelUser = levelGet.result.level;
                } else {
                    res.status(400).json({
                        'sucess': 'false',
                        'error': "can't get User"
                    });
                }
            }.bind(this));

            let charater = new characterModule(this.levelUser);
            charater.createNewCharacter();
            console.log(charater);
            let characterJson = JSON.stringify(charater);
            res.status(200).json({
                'success': 'true',
                'result': characterJson
            });

        }.bind(this));
    }
};