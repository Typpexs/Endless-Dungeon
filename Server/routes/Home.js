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

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let columnArray = ["*"];
            let tableArray = ["user", "user_resource"];
            let onArray = ["user.id=user_resource.id_user"];

            let payloadArray = [
                "user.id="+userId
            ]

            this.db.getDataWithJoin(columnArray, tableArray, onArray, 0, payloadArray, function(data) {
                if (data.success) {
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

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

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
                    return;
                }
            }.bind(this));

            let charactersJson = []
            for (var i = 0; i < 4; i++) {
                let charater = new characterModule(this.levelUser);
                charater.createNewCharacter();
                charactersJson.push(JSON.stringify(charater));
            }

            res.status(200).json({
                'success': 'true',
                'result': charactersJson
            });

        }.bind(this));

        home.get('/profession', function(req, res) {

            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let response = []

            let payloadId = {
                "id_user": userId,
            }
            this.db.getData("id_blueprint", "user_blueprint", payloadId, function(id_blueprint_user) {
                if (id_blueprint_user.success) {
                    let tabIdBlueprintUser = []
                    let idBlueprintUserTabResult = id_blueprint_user.result
                    Array.prototype.forEach.call(idBlueprintUserTabResult, idBlueprint => {
                        tabIdBlueprintUser.push(idBlueprint.id_blueprint)
                      });

                    let columnArrayUser = ["*"];
                    let tableArrayUser = ["user_profession", "blueprint", "blueprint_resources"];
                    let onArrayUser = [
                          "user_profession.id_profession=blueprint.id_profession",
                          "blueprint.id=blueprint_resources.id_blueprint"
                      ];

                    this.db.getDataWithJoinMultipleWhere(columnArrayUser, tableArrayUser, onArrayUser, 0, "blueprint.id", tabIdBlueprintUser, function(resources) {
                        if (resources.success) {
                            response.push(resources.result)
                        }
                    })
                }

                let paramsWhere = [
                    "user_profession.id_user="+userId,
                    "blueprint.basic=0",
                    "blueprint.level_required<=user_profession.level"
                ];
                let columnArray = ["*"];
                let tableArray = ["user_profession", "blueprint", "blueprint_resources"];
                let onArray = [
                    "user_profession.id_profession=blueprint.id_profession",
                    "blueprint.id=blueprint_resources.id_blueprint"
                ];
    
                this.db.getDataWithJoin(columnArray, tableArray, onArray, 0, paramsWhere, function(data) {
                    if (data.success) {
                        response.push(data.result)
                        res.status(200).json({
                            'success': 'true',
                            'result': response
                        });
                    } else {
                        res.status(400).json({
                            'success': 'false',
                            'error': data.msg
                        });
                        return;
                    }
                });
            }.bind(this));

        }.bind(this));
    }
};