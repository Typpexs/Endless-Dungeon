var express = require('express');
var editor = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
let tools = new toolsModule();
var characterModule = require('../modules/Character');

editor.use(bodyParser.json());
editor.use(bodyParser.urlencoded({ extended: true }));

module.exports = class Editor {
    constructor(db = null) {
        this.db = db;
        // lvl 1-10 -- 11-20 -- 21-30
        this.costByLevelMob = [0,20,80,160]
        this.initRoutes();
    }

    get routes() { return editor; }

    initRoutes() {
        editor.get('/', function(req, res) {
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
            this.db.getDataOneColumn("donjon_seed", "user", payload, function(donjon) {
                if (donjon.success) {
                    res.status(200).json({
                        'success': 'true',
                        'result': donjon.result.donjon_seed
                    });
                    return;
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't get User"
                    });
                    return;
                }
            });

        }.bind(this));

        // editor.get('/mob', function(req, res) {
        //     let userId = tools.getUserId(req.headers['authorization']);

        //     if (userId == -1) {
        //         res.status(400).json({
        //             'success': 'false',
        //             'error': 'bad token'
        //         });
        //         return;
        //     }

        //     let payload = {
        //         id_user: userId
        //     }

        //     this.db.getData("*", "mob", payload, function(mobs) {
        //         if (mobs.success) {
        //             res.status(200).json({
        //                 'success': 'true',
        //                 'result': mobs.result
        //             });
        //         } else {
        //             res.status(400).json({
        //                 'success': 'false',
        //                 'error': "can't get mobs"
        //             });
        //             return;
        //         }
        //     });

        // }.bind(this));

        editor.get('/trap', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let payload = {
                id_user: userId
            }

            this.db.getData("*", "user_trap", payload, function(traps) {
                if (traps.success) {
                    res.status(200).json({
                        'success': 'true',
                        'result': traps.result
                    });
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't get traps"
                    });
                    return;
                }
            });

        }.bind(this));

        editor.post('/placeMobs', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let params = req.body;
            let values = []

            for (let i=0; i < params.mobs.length; i++) {
                let tab = {}
                tab["key"] = "is_placed"
                tab["value"] = params.mobs[i].is_placed
                let tabWhere = [
                    {whereKey: "id", whereValue: params.mobs[i].id},
                    {whereKey: "id_user", whereValue: userId}
                ]
                tab["where"] = tabWhere
                values.push(tab);
            }

            this.db.update("mob_inventory", values, function(updateMob) {
                if (updateMob.success) {
                    res.status(200).json({
                        'success': 'true'
                    });
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't update mobs"
                    });
                    return;
                }
            });

        }.bind(this));

        editor.post('/placeTraps', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let params = req.body;
            let values = []

            for (let i=0; i < params.traps.length; i++) {
                let tab = {}
                tab["key"] = "is_placed"
                tab["value"] = params.traps[i].is_placed
                let tabWhere = [
                    {whereKey: "id", whereValue: params.traps[i].id},
                    {whereKey: "id_user", whereValue: userId}
                ]
                tab["where"] = tabWhere
                values.push(tab);
            }

            this.db.update("user_trap", values, function(updateTrap) {
                if (updateTrap.success) {
                    res.status(200).json({
                        'success': 'true'
                    });
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't update traps"
                    });
                    return;
                }
            });

        }.bind(this));
    
        editor.post('/save', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let params = req.body;
            let values = []
            let tab = {}
            tab["key"] = "donjon_seed"
            tab["value"] = params.donjon
            let tabWhere = [
                {whereKey: "id", whereValue: userId}
            ]
            tab["where"] = tabWhere
            values.push(tab)

            this.db.update("user", values, function(updateDonjon) {
                if (updateDonjon.success) {
                    res.status(200).json({
                        'success': 'true'
                    });
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't update dungeon"
                    });
                    return;
                }
            });

        }.bind(this));

        editor.get('/shopTrapShow', function(req, res) {
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
            this.db.getDataOneColumn("rooms", "user", payload, function(nbRooms) {
                if (nbRooms.success) {
                    this.db.getDataWithoutParams("*", "trap", function(traps) {
                        if (traps.success) {
                            res.status(200).json({
                                'success': 'true',
                                'data': [nbRooms.result, traps.result]
                            });
                        } else {
                            res.status(400).json({
                                'success': 'false',
                                'error': "can't get Traps"
                            });                            
                            return;                                        
                        }
                    }.bind(this));
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't get User"
                    });
                    return;
                }
            }.bind(this));

        }.bind(this));

        editor.get('/shopMobShow', function(req, res) {
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
            this.db.getDataOneColumn("rooms", "user", payload, function(nbRooms) {
                if (nbRooms.success) {
                    this.db.getDataWithoutParams("*", "mob", function(traps) {
                        if (traps.success) {
                            res.status(200).json({
                                'success': 'true',
                                'data': [nbRooms.result, traps.result]
                            });
                        } else {
                            res.status(400).json({
                                'success': 'false',
                                'error': "can't get Mobs"
                            });                            
                            return;                                        
                        }
                    }.bind(this));
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't get User"
                    });
                    return;
                }
            }.bind(this));
        }.bind(this));

        editor.post('/shopTrapBuy', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
        
            if (userId == -1) {
                return res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
            }
        
            const trap_id = parseInt(req.body.id);
            const trapError = "can't find trap"

            Promise.all([
                dbRequest(this.db, "getDataOneColumn", ["rooms", "user", { id: userId }], "can't get user"),
                dbRequest(this.db, "getDataWithEmpty", ["*", "user_trap", { id_user: userId, id_trap: trap_id }], trapError),
                dbRequest(this.db, "getDataOneColumn", ["cost", "trap", { id: trap_id }], trapError),
                dbRequest(this.db, "getDataOneColumn", ["gold", "user_resource", { id_user: userId }], "can't find resource player")
            ])
            .then((rooms) => {
        
                const cost = rooms[2].result.cost,
                    gold = rooms[3].result.gold,
                    fundError = "not enouth minerals"

                if (((rooms[0].result.rooms - 1) - rooms[1].result.length) <= 0) {
                    return Promise.reject("can't buy more traps");
                }
                else if (gold < cost)  {
                    return Promise.reject(fundError);
                }
                let values = []
                let tab = {
                    key: 'gold',
                    value: gold - cost,
                    where: [{whereKey: "id_user", whereValue: userId}]
                }
                values.push(tab)

                return dbRequest(this.db, "update", ["user_resource", values], fundError)
            }) 
            .then(() => dbRequest(this.db, "insert", ["user_trap", { id_user: userId, id_trap: trap_id}]))
            .then(() => res.status(200).json({'success': 'true' }))
            .catch((errorMessage) => {
                res.status(400).json({ 'success': 'false', 'error': errorMessage })
            })
        }.bind(this));
        
        editor.post('/shopMobBuy', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let params = req.body;
            let payloadGetMoney = {
                id_user: userId
            }
            this.db.getDataOneColumn("gold", "user_resource", payloadGetMoney, function(money) {
                if (money.success){
                    if (money.result.gold >= this.costByLevelMob[params.idLvlMob]) {
                        let values = []
                        let tab = {}
                        tab["key"] = "gold"
                        tab["value"] = money.result.gold - this.costByLevelMob[params.idLvlMob]
                        let tabWhere = [
                            {whereKey: "id_user", whereValue: userId}
                        ]
                        tab["where"] = tabWhere
                        values.push(tab)
                        this.db.update("user_resource", values, function(updateMoney) {
                            if (updateMoney.success) {
                                let character = new characterModule(tools.generateRandomLvl((params.idLvlMob*10-9), (params.idLvlMob*10)))
                                character.createNewCharacter();
                                let payloadCharacter = {
                                    id_user: userId,
                                    id_classe: character.classe,
                                    name: character.name,
                                    level: character.level,
                                    hp_max: character.hpMax,
                                    mana_max: character.manaMax,
                                    stamina: character.principaleStats.stamina,
                                    armor: character.principaleStats.armor,
                                    strength: character.principaleStats.strength,
                                    dexterity: character.principaleStats.dexterity,
                                    intelligence: character.principaleStats.intelligence,
                                    speed: character.principaleStats.speed,
                                    critical_rate: character.secondaryStats.criticalRate,
                                    critical_damage: character.secondaryStats.criticalDamage,
                                    spirit: character.secondaryStats.spirit,
                                    touch: character.secondaryStats.touch,
                                    dodge: character.secondaryStats.dodge,
                                    block: character.secondaryStats.block,
                                    resistance: character.secondaryStats.resistance
                                }
                                this.db.insert("mob", payloadCharacter, function(mobInserted) {
                                    if (mobInserted.success) {

                                        this.db.getData("id", "mob", {id_user: userId}, function(idMob) {
                                            if (idMob.success) {
                                                let payloadCharacterInventory = {
                                                    id_user: userId,
                                                    id_mob: idMob.result[idMob.result.length-1].id
                                                }
                                                this.db.insert("mob_inventory", payloadCharacterInventory, function(inventory) {
                                                    if (inventory.success) {
                                                        res.status(200).json({
                                                            'success': true
                                                        });
                                                    } else {
                                                        res.status(400).json({
                                                            'success': 'false',
                                                            'error': 'can t insert inventory',
                                                        });
                                                        return;                                                        
                                                    }
                                                });
                                            } else {
                                                res.status(400).json({
                                                    'success': 'false',
                                                    'error': 'can t get id mob'
                                                });
                                                return;
                                            }
                                        }.bind(this));
                                    } else {
                                        res.status(400).json({
                                            'success': 'false',
                                            'error': 'can t insert mob'
                                        });
                                        return;                                     
                                    }
                                }.bind(this));                        
                            } else {
                                res.status(400).json({
                                    'success': 'false',
                                    'error': 'can t update moneyyy'
                                });
                                return;
                            } 
                        }.bind(this));
                    } else {
                        res.status(200).json({
                            'success': 'false',
                            'error': 'not enouth minerals'
                        });
                        return;                        
                    }
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': 'can t get user'
                    });
                    return;
                }
            }.bind(this));
            
        }.bind(this));

        function dbRequest(db, func, params, errorMessage) {
            return new Promise((resolve, reject) => {
        
                params.push((response) => {
                    if (response.success) {
                        return resolve(response)
                    }
                    return reject(errorMessage ? errorMessage : response.msg);
                })
                db[func].apply(db, params)
            })
        }

    }

}