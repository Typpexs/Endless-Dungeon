var express = require('express');
var characterRoute = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
let tools = new toolsModule();
var characterModule = require('../modules/Character');

characterRoute.use(bodyParser.json());
characterRoute.use(bodyParser.urlencoded({ extended: true }));

module.exports = class CharacterRoute {
    constructor(db = null) {
        this.db = db;

        this.slotItem = [
            "id_user_item_head",
            "id_user_item_shoulders",
            "id_user_item_chest",
            "id_user_item_hands",
            "id_user_item_legs",
            "id_user_item_feet",
            "id_user_item_weapon_1",
            "id_user_item_weapon_2",
        ]
        this.initRoutes();
    }

    get routes() { return characterRoute; }

    initRoutes() {

        characterRoute.get('/', function(req, res) {
            res.status(200).json({
                'success': 'true',
                'message': 'Hi o/'
            })
        });

        characterRoute.get('/showCharacter', function(req, res) {
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

            this.db.getDataWithEmpty("*", "user_character", payload, function(character) {
                if (character.success) {
                    res.status(200).json({
                        'success': 'true',
                        'result': character.result
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

        characterRoute.get('/showMob', function(req, res) {
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

            this.db.getDataWithEmpty("*", "mob", payload, function(mobs) {
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

        characterRoute.get('/showCharacterInventory', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
        
            if (userId == -1) {
                return res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
            }
        
            const char_id = parseInt(req.body.id);
            let stuffCharacter = {}
            
            dbRequest(this.db, "getDataOneColumn", ["*", "character_inventory", {id_character: char_id}], "can't get character")
            .then((characterOne) => {
                const character = characterOne.result
                const characterEntries = Object.entries(character).slice(3);
                let stringId = "("
                characterEntries.forEach(function(element) {
                    if (element[1]) {
                        stuffCharacter[element[0]] = ""
                        stringId += `${element[1]},`
                    }
                })
                stringId = stringId.replace(/.$/,")")
                return dbRequest(this.db, "getDataWithIn", ["*", "user_item", "id in "+stringId], "can't get items")
            })
            .then((stuffDataPacket) => {
                let stuff = stuffDataPacket.result
                let i = 0;
                Object.entries(stuffCharacter).forEach(function(element) {
                    stuffCharacter[element[0]] = stuff[i]
                    i++;
                })
                res.status(200).json({
                    'success': 'true',
                    'result': stuffCharacter
                })
            })
            .catch((errorMessage) => {
                console.log(errorMessage)
                res.status(400).json({ 'success': 'false', 'error': errorMessage })
            })
        }.bind(this));

        characterRoute.get('/showMobInventory', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
        
            if (userId == -1) {
                return res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
            }
        
            const mob_id = parseInt(req.body.id);
            let stuffMob = {}
            
            dbRequest(this.db, "getDataOneColumn", ["*", "mob_inventory", {id_mob: mob_id}], "can't get mob")
            .then((mobOne) => {
                const mob = mobOne.result
                const mobEntries = Object.entries(mob).slice(3);
                let stringId = "("
                mobEntries.forEach(function(element) {
                    if (element[1]) {
                        stuffMob[element[0]] = ""
                        stringId += `${element[1]},`
                    }
                })
                stringId = stringId.replace(/.$/,")")
                return dbRequest(this.db, "getDataWithIn", ["*", "user_item", "id in "+stringId], "can't get items")
            })
            .then((stuffDataPacket) => {
                let stuff = stuffDataPacket.result
                let i = 0;
                Object.entries(stuffMob).forEach(function(element) {
                    stuffMob[element[0]] = stuff[i]
                    i++;
                })
                res.status(200).json({
                    'success': 'true',
                    'result': stuffMob
                })
            })
            .catch((errorMessage) => {
                console.log(errorMessage)
                res.status(400).json({ 'success': 'false', 'error': errorMessage })
            })
        }.bind(this));

        characterRoute.post('/addStuffToCharacter', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            const idChar = req.body.idChar
            const idUserItem = req.body.idUserItem
            const idSlotItem = req.body.idSlotItem
            
            dbRequest(this.db, "getData", ["is_placed, id_item", "user_item", {id: idUserItem, id_user: userId}], "can't get Item")
            .then((item) => {
                if (item.result[0].is_placed == 0) {
                    return Promise.reject("item already placed");
                }
                return dbRequest(this.db, "getDataWithEmpty", ["id_slot_item", "item", {id: item.result[0].id_item, id_slot_item: idSlotItem}], "can't get Item Slot")
            })
            .then((slot) => {
                return dbRequest(this.db, "getDataOneColumn", [this.slotItem[idSlotItem], "character_inventory", {id_character: idChar}], "can't get actual stuff")
            })
            .then((stuff) => {
                let stuffEquiped = stuff.result
                let stuffEquipedEndtries = Object.entries(stuffEquiped)[0]
                if (stuffEquipedEndtries[1]) {
                    dbRequest(this.db, "getData", ["*", "user_inventory", {id_user: userId}], "can't get user inventory")
                    .then((user_inventory) => {
                        const inventory = user_inventory.result[0]
                        const inventoryEntries = Object.entries(inventory).slice(2);
                        let isInInventary = false;
                        inventoryEntries.forEach(function(element) {
                            if (!element[1] && !isInInventary) {
                                let values = []
                                let tab = {
                                    key: element[0],
                                    value: stuffEquipedEndtries[1],
                                    where: [{whereKey: "id_user", whereValue: userId}]
                                }
                                values.push(tab)
                                dbRequest(this.db, "update", ["user_inventory", values], "can't update inventory")
                                .then(() => {
                                    let valuesUpdateItemStocked = []
                                    let tabUpdateItemStocked = {
                                        key: 'is_placed',
                                        value: 1,
                                        where: [{whereKey: "id", whereValue: stuffEquipedEndtries[1]}]
                                    }
                                    valuesUpdateItemStocked.push(tabUpdateItemStocked)
                                    dbRequest(this.db, "update", ["user_item", valuesUpdateItemStocked], "can't update item")

                                    let valuesUpdateMobInventory = []
                                    let tabUpdateMobInventory = {
                                        key: stuffEquipedEndtries[0],
                                        value: null,
                                        where: [{whereKey: "id_character", whereValue: idChar}]
                                    }
                                    valuesUpdateMobInventory.push(tabUpdateMobInventory)
                                    dbRequest(this.db, "update", ["character_inventory", valuesUpdateMobInventory], "can't update mob inventory")

                                    console.log("Avant l'envoi du stuff")
                                    let valuesUpdateMobInventoryIf = []
                                    let tabUpdateMobInventoryIf = {
                                        key: stuffEquipedEndtries[0],
                                        value: idUserItem,
                                        where: [
                                            {whereKey: "id_character", whereValue: idChar},
                                            {whereKey: "id_user", whereValue: userId}
                                        ]
                                    }
                                    valuesUpdateMobInventoryIf.push(tabUpdateMobInventoryIf)
                                    dbRequest(this.db, "update", ["character_inventory", valuesUpdateMobInventoryIf], "can't update mob inventory to add item")
                
                                    let valuesUpdateUserItemIf = []
                                    let tabUpdateUserItemIf = {
                                        key: 'is_placed',
                                        value: 0,
                                        where: [
                                            {whereKey: "id_item", whereValue: idUserItem},
                                            {whereKey: "id_user", whereValue: userId}
                                        ]
                                    }
                                    valuesUpdateUserItemIf.push(tabUpdateUserItemIf)
                                    dbRequest(this.db, "update", ["user_item", valuesUpdateUserItemIf], "can't update user items to change is placed")
                
                                    res.status(200).json({'success': 'true'})
                                });
                                isInInventary = true;
                            }
                        }.bind(this))
                        console.log("Après la boucle")
                    })
                } else {
                    console.log("Avant l'envoi du stuff")
                    let valuesUpdateMobInventoryElse = []
                    let tabUpdateMobInventoryElse = {
                        key: stuffEquipedEndtries[0],
                        value: idUserItem,
                        where: [
                            {whereKey: "id_character", whereValue: idChar},
                            {whereKey: "id_user", whereValue: userId}
                        ]
                    }
                    valuesUpdateMobInventoryElse.push(tabUpdateMobInventoryElse)
                    dbRequest(this.db, "update", ["character_inventory", valuesUpdateMobInventoryElse], "can't update mob inventory to add item")

                    let valuesUpdateUserItemElse = []
                    let tabUpdateUserItemElse = {
                        key: 'is_placed',
                        value: 0,
                        where: [
                            {whereKey: "id_item", whereValue: idUserItem},
                            {whereKey: "id_user", whereValue: userId}
                        ]
                    }
                    valuesUpdateUserItemElse.push(tabUpdateUserItemElse)
                    dbRequest(this.db, "update", ["user_item", valuesUpdateUserItemElse], "can't update user items to change is placed")

                    res.status(200).json({'success': 'true'})
                }
            })
            .catch((errorMessage) => {
                console.log(errorMessage)
                res.status(400).json({ 'success': 'false', 'error': errorMessage })
            })

        }.bind(this));

        characterRoute.post('/addStuffToMob', multipartMiddleware, function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);

            if (userId == -1) {
                res.status(400).json({
                    'success': 'false',
                    'error': 'bad token'
                });
                return;
            }

            const idMob = req.body.idMob
            const idUserItem = req.body.idUserItem
            const idSlotItem = req.body.idSlotItem
            
            dbRequest(this.db, "getData", ["is_placed, id_item", "user_item", {id: idUserItem, id_user: userId}], "can't get Item")
            .then((item) => {
                if (item.result[0].is_placed == 0) {
                    return Promise.reject("item already placed");
                }
                return dbRequest(this.db, "getDataWithEmpty", ["id_slot_item", "item", {id: item.result[0].id_item, id_slot_item: idSlotItem}], "can't get Item Slot")
            })
            .then((slot) => {
                return dbRequest(this.db, "getDataOneColumn", [this.slotItem[idSlotItem], "mob_inventory", {id_mob: idMob}], "can't get actual stuff")
            })
            .then((stuff) => {
                let stuffEquiped = stuff.result
                let stuffEquipedEndtries = Object.entries(stuffEquiped)[0]
                if (stuffEquipedEndtries[1]) {
                    dbRequest(this.db, "getData", ["*", "user_inventory", {id_user: userId}], "can't get user inventory")
                    .then((user_inventory) => {
                        const inventory = user_inventory.result[0]
                        const inventoryEntries = Object.entries(inventory).slice(2);
                        let isInInventary = false;
                        inventoryEntries.forEach(function(element) {
                            if (!element[1] && !isInInventary) {
                                let values = []
                                let tab = {
                                    key: element[0],
                                    value: stuffEquipedEndtries[1],
                                    where: [{whereKey: "id_user", whereValue: userId}]
                                }
                                values.push(tab)
                                dbRequest(this.db, "update", ["user_inventory", values], "can't update inventory")
                                .then(() => {
                                    let valuesUpdateItemStocked = []
                                    let tabUpdateItemStocked = {
                                        key: 'is_placed',
                                        value: 1,
                                        where: [{whereKey: "id", whereValue: stuffEquipedEndtries[1]}]
                                    }
                                    valuesUpdateItemStocked.push(tabUpdateItemStocked)
                                    dbRequest(this.db, "update", ["user_item", valuesUpdateItemStocked], "can't update item")

                                    let valuesUpdateMobInventory = []
                                    let tabUpdateMobInventory = {
                                        key: stuffEquipedEndtries[0],
                                        value: null,
                                        where: [{whereKey: "id_mob", whereValue: idMob}]
                                    }
                                    valuesUpdateMobInventory.push(tabUpdateMobInventory)
                                    dbRequest(this.db, "update", ["mob_inventory", valuesUpdateMobInventory], "can't update mob inventory")

                                    console.log("Avant l'envoi du stuff")
                                    let valuesUpdateMobInventoryIf = []
                                    let tabUpdateMobInventoryIf = {
                                        key: stuffEquipedEndtries[0],
                                        value: idUserItem,
                                        where: [
                                            {whereKey: "id_mob", whereValue: idMob},
                                            {whereKey: "id_user", whereValue: userId}
                                        ]
                                    }
                                    valuesUpdateMobInventoryIf.push(tabUpdateMobInventoryIf)
                                    dbRequest(this.db, "update", ["mob_inventory", valuesUpdateMobInventoryIf], "can't update mob inventory to add item")
                
                                    let valuesUpdateUserItemIf = []
                                    let tabUpdateUserItemIf = {
                                        key: 'is_placed',
                                        value: 0,
                                        where: [
                                            {whereKey: "id_item", whereValue: idUserItem},
                                            {whereKey: "id_user", whereValue: userId}
                                        ]
                                    }
                                    valuesUpdateUserItemIf.push(tabUpdateUserItemIf)
                                    dbRequest(this.db, "update", ["user_item", valuesUpdateUserItemIf], "can't update user items to change is placed")
                
                                    res.status(200).json({'success': 'true'})
                                });
                                isInInventary = true;
                            }
                        }.bind(this))
                        console.log("Après la boucle")
                    })
                } else {
                    console.log("Avant l'envoi du stuff")
                    let valuesUpdateMobInventoryElse = []
                    let tabUpdateMobInventoryElse = {
                        key: stuffEquipedEndtries[0],
                        value: idUserItem,
                        where: [
                            {whereKey: "id_mob", whereValue: idMob},
                            {whereKey: "id_user", whereValue: userId}
                        ]
                    }
                    valuesUpdateMobInventoryElse.push(tabUpdateMobInventoryElse)
                    dbRequest(this.db, "update", ["mob_inventory", valuesUpdateMobInventoryElse], "can't update mob inventory to add item")

                    let valuesUpdateUserItemElse = []
                    let tabUpdateUserItemElse = {
                        key: 'is_placed',
                        value: 0,
                        where: [
                            {whereKey: "id_item", whereValue: idUserItem},
                            {whereKey: "id_user", whereValue: userId}
                        ]
                    }
                    valuesUpdateUserItemElse.push(tabUpdateUserItemElse)
                    dbRequest(this.db, "update", ["user_item", valuesUpdateUserItemElse], "can't update user items to change is placed")

                    res.status(200).json({'success': 'true'})
                }
            })
            .catch((errorMessage) => {
                console.log(errorMessage)
                res.status(400).json({ 'success': 'false', 'error': errorMessage })
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
}