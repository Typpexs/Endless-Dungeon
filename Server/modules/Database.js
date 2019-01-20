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
        this.joinMethod = [];
        this.joinMethod[0] = " INNER JOIN ";
        this.joinMethod[1] = " LEFT JOIN ";
        this.joinMethod[2] = " RIGHT JOIN ";
        this.joinMethod[3] = " FULL JOIN ";
    }

    insert(table, params, callback) {
        var sqlInsert = "INSERT INTO "+table+" SET ?";
        this.connection.query(sqlInsert, params, function(err, res) {
            let tabResult = {};
            if(err) {
                tabResult["success"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["success"] = true;
            }
            callback(tabResult);
        });
    }

    checkLogin(params, callback) {
        var sqlLogin = "SELECT * FROM logs WHERE email = ?";
        this.connection.query(sqlLogin, params.email, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["success"] = false;
                tabResult["msg"] = "Wrong email";
                callback(tabResult);
            } else {
                tools.compareEncryptString(params.password, result[0].password, function(isGoodPassword) {
                    if (err) {
                        tabResult["success"] = false;
                        tabResult["msg"] = "Wrong email or password";
                    } else {
                        if (isGoodPassword) {
                            tabResult["success"] = true;
                            tabResult["id"] = result[0].id;
                        } else {
                            tabResult["success"] = false;
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
                tabResult["success"] = false;
                tabResult["msg"] = "Wrong email";
            } else {
                tabResult["success"] = true;
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
                tabResult["success"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["success"] = true;
                tabResult["result"] = result[0];
            }
            callback(tabResult);
        });
    }

    // SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    // FROM Orders
    // INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;

    //array to string for select;
    //columnArray example : Orders.OrderID, Customers.CustomerName, Orders.OrderDate ...
    //tableArray example : Orders, Customers ...
    //onArray example : Orders.CustomerID=Customers.CustomerID ...
    //pârams for Where clause example = "user.id": userId
    getDataWithJoin(columnArray, tableArray, onArray, indexJoinMethod, params, callback) {
        let stringJoin = "";
        
        for (let i=1; i < tableArray.length; i++) {
            stringJoin += this.joinMethod[indexJoinMethod]+tableArray[i]+" ON "+onArray[i-1];
        }

        var sqlData = "SELECT "+columnArray.join(', ')+" FROM "+tableArray[0]+stringJoin+ " WHERE ?";
        this.connection.query(sqlData, params, function(err, result) {
            let tabResult = {};
            if (err || !result || !result[0]) {
                tabResult["success"] = false;
                tabResult["msg"] = "join failed";
            } else {
                tabResult["success"] = true;
                tabResult["result"] = result;
            }
            callback(tabResult);
        });
    }
};