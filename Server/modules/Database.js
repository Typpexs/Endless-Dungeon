var mysql = require('mysql');
var toolsModule = require('../modules/Tools');
let tools = new toolsModule();

module.exports = class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "endless_dungeon",
            multipleStatements: true
        });

        this.connection.connect(function (err){
            if (err) throw err;
            console.log("Le serveur s'est bien connecté sur la base de donnée MYSQL")
        });
    }

    insert(table, params, callback) {
        var sqlInsert = "INSERT INTO "+table+" SET ?";
        this.connection.query(sqlInsert, params, function(err, res) {
            let tabResult = {};
            if(err) {
                tabResult["succes"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["succes"] = true;
            }
            callback(tabResult);
        });
    }

    checkLogin(params, callback) {
        var sqlLogin = "SELECT * FROM logs WHERE email = ?";
        this.connection.query(sqlLogin, params.email, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["succes"] = false;
                tabResult["msg"] = "Wrong email";
                callback(tabResult);
            } else {
                tools.compareEncryptString(params.password, result[0].password, function(isGoodPassword) {
                    if (err) {
                        tabResult["success"] = false;
                        tabResult["msg"] = "Wrong email or password";
                    } else {
                        if (isGoodPassword) {
                            tabResult["succes"] = true;
                            tabResult["id"] = result[0].id;
                        } else {
                            tabResult["succes"] = false;
                            tabResult["msg"] = "Wrong password";
                        }
                    }
                    callback(tabResult);
                });
            }
        });
    }

    getIdWithMail(params, callback) {
        var sqlLogin = "SELECT id FROM logs WHERE email = ?";
        this.connection.query(sqlLogin, params.email, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["succes"] = false;
                tabResult["msg"] = "Wrong email";
            } else {
                tabResult["succes"] = true;
                tabResult["id"] = result[0].id;
            }
            callback(tabResult);
        });
    }

    getDataOneColumn(column, table, params, callback) {
        var sqlData = "SELECT "+column+" FROM "+table+" WHERE ?";
        this.connection.query(sqlData, params, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["succes"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["succes"] = true;
                tabResult["result"] = result[0];
            }
            callback(tabResult);
        });
    }
};