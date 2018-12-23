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
            if (err) {
                tabResult["succes"] = false;
                tabResult["msg"] = err;
            } else {
                tools.compareEncryptString(params.password, result[0].password, function(isGoodPassword) {
                    if (isGoodPassword) {
                        tabResult["succes"] = true;
                        tabResult["msg"] = result;
                    } else {
                        tabResult["succes"] = false;
                        tabResult["msg"] = "Wrong password";
                    }
                    callback(tabResult);
                });
            }
        });
    }
};