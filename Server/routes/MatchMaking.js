var express = require('express');
var matchMakingRoute = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
let tools = new toolsModule();

matchMakingRoute.use(bodyParser.json());
matchMakingRoute.use(bodyParser.urlencoded({ extended: true }));

module.exports = class MatchMakingRoute {
    constructor(db = null) {
        this.db = db;
        this.initRoutes();
    }

    get routes() { return matchMakingRoute; }

    initRoutes() {

        matchMakingRoute.get('/', function(req, res) {
            res.status(200).json({
                'success': 'true',
                'message': 'Hi o/'
            })
        });

        matchMakingRoute.get('/search', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
        
            if (userId == -1) {
                return res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
            }

            dbRequest(this.db, "getDataOneColumn", ["rank_point", "user", {id: userId}], "can't get user")
            .then((rankPoint) => {
                let point = rankPoint.result.rank_point
                return dbRequest(this.db, "getDataWithEmptyBetween", ["*", "user", {donjon_seed: "IS NOT NULL", id: "NOT "+userId, rank_point: (point-20)+" AND "+(point+20)}])
            })
            .then((users) => {
                res.status(200).json({'success': 'true', 'data': users.result})
            })
            .catch((errorMessage) => {
                console.log(errorMessage)
                res.status(400).json({'success': 'false', 'error': errorMessage})
            })
        }.bind(this));

        matchMakingRoute.post('/finish', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
        
            if (userId == -1) {
                return res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
            }

            let rankPointPlayer = 0
            let rankPointEnemy = 0
            let goldPlayer = 0
            let goldEnemy = 0
            let bloodPlayer = 0
            let bloodEnemy = 0
            let newRankPlayer = 0
            let newGoldPlayer = 0
            let newBloodPlayer = 0
            let newRankEnemy = 0
            let newGoldEnemy = 0
            let newBloodEnemy = 0

            const idEnemy = req.body.idEnemy
            const isWin = req.body.isWin

            let columnArray = ["*"];
            let tableArray = ["user", "user_resource"];
            let onArray = ["user.id=user_resource.id_user"];

            let payloadArrayPlayer = [
                "user.id="+userId
            ]

            let payloadArrayEnemy = [
                "user.id="+idEnemy
            ]

            Promise.all([
                dbRequest(this.db, "getDataWithJoin", [columnArray, tableArray, onArray, 0, payloadArrayPlayer], "can't get user"),
                dbRequest(this.db, "getDataWithJoin", [columnArray, tableArray, onArray, 0, payloadArrayEnemy], "can't get enemy")
                // dbRequest(this.db, "getDataOneColumn", ["rank_point", "user", {id: userId}], "can't get user"),
                // dbRequest(this.db, "getDataOneColumn", ["rank_point", "user", {id: idEnemy}], "can't get enemy")
            ])        
            .then((rankPoint) => {
                rankPointPlayer = rankPoint[0].result[0].rank_point
                goldPlayer = rankPoint[0].result[0].gold
                bloodPlayer = rankPoint[0].result[0].blood
                rankPointEnemy = rankPoint[1].result[0].rank_point
                goldEnemy = rankPoint[1].result[0].gold
                bloodEnemy = rankPoint[1].result[0].blood

                newRankPlayer = rankPointPlayer
                newRankEnemy = rankPointEnemy
                newGoldPlayer = goldPlayer
                newGoldEnemy = goldEnemy
                newBloodPlayer = bloodPlayer
                newBloodEnemy = bloodEnemy

                if (isWin) {
                    newRankPlayer = rankPointPlayer + 20
                    newRankEnemy = rankPointEnemy - 20
                    newGoldPlayer = goldPlayer + (goldEnemy*0.05)
                    newGoldEnemy = goldEnemy - (goldEnemy*0.05)
                    newBloodPlayer = bloodPlayer + (bloodEnemy*0.05)
                    newBloodEnemy = bloodEnemy - (bloodEnemy*0.05)
                } else {
                    newRankPlayer = rankPointPlayer - 10
                    newRankEnemy = rankPointEnemy + 10 
                }
                
                let valuesRankPlayer = []
                let tabRankPlayer = {
                    key: 'rank_point',
                    value: newRankPlayer,
                    where: [{whereKey: "id", whereValue: userId}]
                }
                valuesRankPlayer.push(tabRankPlayer)

                let valuesRankEnemy = []
                let tabRankEnemy = {
                    key: 'rank_point',
                    value: newRankEnemy,
                    where: [{whereKey: "id", whereValue: idEnemy}]
                }
                valuesRankEnemy.push(tabRankEnemy)

                let valuesGoldPlayer = []
                let tabGoldPlayer = {
                    key: 'gold',
                    value: newGoldPlayer,
                    where: [{whereKey: "id_user", whereValue: userId}]
                }
                valuesGoldPlayer.push(tabGoldPlayer)

                let valuesGoldEnemy = []
                let tabGoldEnemy = {
                    key: 'gold',
                    value: newGoldEnemy,
                    where: [{whereKey: "id_user", whereValue: idEnemy}]
                }
                valuesGoldEnemy.push(tabGoldEnemy)

                let valuesBloodPlayer = []
                let tabBloodPlayer = {
                    key: 'blood',
                    value: newBloodPlayer,
                    where: [{whereKey: "id_user", whereValue: userId}]
                }
                valuesBloodPlayer.push(tabBloodPlayer)

                let valuesBloodEnemy = []
                let tabBloodEnemy = {
                    key: 'blood',
                    value: newBloodEnemy,
                    where: [{whereKey: "id_user", whereValue: idEnemy}]
                }
                valuesBloodEnemy.push(tabBloodEnemy)

                Promise.all([
                    dbRequest(this.db, "update", ["user", valuesRankPlayer], "update rankPointPlayer"),
                    dbRequest(this.db, "update", ["user", valuesRankEnemy], "update rankPointEnemy"),
                    dbRequest(this.db, "update", ["user_resource", valuesGoldPlayer], "update rankGoldPlayer"),
                    dbRequest(this.db, "update", ["user_resource", valuesGoldEnemy], "update rankGoldEnemy"),
                    dbRequest(this.db, "update", ["user_resource", valuesBloodPlayer], "update rankBloodPlayer"),
                    dbRequest(this.db, "update", ["user_resource", valuesBloodEnemy], "update rankBloodEnemy")
                ])
            })
            .then(() => {
                res.status(200).json({'success': 'true'})
            })
            .catch((errorMessage) => {
                console.log(errorMessage)
                res.status(400).json({'success': 'false', 'error': errorMessage})
            })

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
};