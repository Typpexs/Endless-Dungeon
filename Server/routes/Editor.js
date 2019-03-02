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

        editor.get('/mob', function(req, res) {
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

            this.db.getData("*", "mob_inventory", payload, function(mobs) {
                if (mobs.success) {
                    res.status(200).json({
                        'success': 'true',
                        'result': mobs.result
                    });
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': "can't get mobs"
                    });
                    return;
                }
            });

        }.bind(this));

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
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            let params = req.body;
            let payload = {
                id: userId
            }
            this.db.getDataOneColumn("rooms", "user", payload, function(nbRooms) {
                if (nbRooms.success) {
                    let payloadTrap = {
                        id_user: userId,
                        id_trap: parseInt(params.id)
                    }

                    this.db.getDataWithEmpty("*", "user_trap", payloadTrap, function(nbrTraps) {
                        if (nbrTraps.success) {
                            let nbrAchat = (nbRooms.result.rooms - 1) - nbrTraps.result.length;

                            if (nbrAchat > 0) {
                                let payloadGetCost = {
                                    id: parseInt(params.id)
                                }
                                this.db.getDataOneColumn("cost", "trap", payloadGetCost, function(cost) {
                                    if (cost.success) {
                                        let payloadGetMoney = {
                                            id_user: userId
                                        }
                                        this.db.getDataOneColumn("gold", "user_resource", payloadGetMoney, function(money) {
                                            if (money.success) {
                                                if (money.result.gold >= cost.result.cost) {
                                                    let values = []
                                                    let tab = {}
                                                    tab["key"] = "gold"
                                                    tab["value"] = money.result.gold - cost.result.cost
                                                    let tabWhere = [
                                                        {whereKey: "id_user", whereValue: userId}
                                                    ]
                                                    tab["where"] = tabWhere
                                                    values.push(tab)
                                                    this.db.update("user_resource", values, function(updateMoney) {
                                                        if (updateMoney.success) {
                                                            let payloadInsertTrapForUser = {
                                                                id_user: userId,
                                                                id_trap: parseInt(params.id)
                                                            }
                                                            this.db.insert("user_trap", payloadInsertTrapForUser, function(isAdded) {
                                                                if (isAdded.success) {
                                                                    res.status(200).json({
                                                                        'success': 'true'
                                                                    })
                                                                } else {
                                                                    res.status(400).json({
                                                                        'success': 'false',
                                                                        'error': isAdded.msg
                                                                    })
                                                                    return;
                                                                }
                                                            });
                                                        } else {
                                                            res.status(400).json({
                                                                'success': 'false',
                                                                'error': 'not enouth minerals'
                                                            })
                                                            return;                                                            
                                                        }
                                                    }.bind(this));

                                                } else {
                                                    res.status(400).json({
                                                        'success': 'false',
                                                        'error': 'not enouth minerals'
                                                    })
                                                    return;
                                                }
                                            } else {
                                                res.status(400).json({
                                                    'success': 'false',
                                                    'error': 'cant find resource player'
                                                })
                                                return;
                                            }
                                        }.bind(this));
                                    } else {
                                        res.status(400).json({
                                            'success': 'false',
                                            'error': 'can t find trap'
                                        });
                                        return;
                                    }
                                }.bind(this));
                            } else {
                                res.status(200).json({
                                    'success': 'false',
                                    'error': 'cant buy more traps',
                                });
                                return;
                            }

                        } else {
                            res.status(400).json({
                                'success': 'false',
                                'error': 'can t find trap'
                            });
                            return;
                        }
                    }.bind(this));
                } else {
                    res.status(400).json({
                        'success': 'false',
                        'error': 'can t get user'
                    });
                    return;
                }
            }.bind(this));

        }.bind(this));
    }

}