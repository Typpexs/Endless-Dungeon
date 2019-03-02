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

        this.joinOperator = [];
        this.joinOperator[0] = " = ";
        this.joinOperator[1] = " < ";
        this.joinOperator[2] = " <= ";
        this.joinOperator[3] = " > ";
        this.joinOperator[4] = " >= ";
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

    update(table, values, callback) {
        for (let i=0; i < values.length; i++) {

            let stringWhere = "";
            for (let j=0; j < values[i].where.length-1; j++) {
                stringWhere += values[i].where[j].whereKey + "=" + values[i].where[j].whereValue + " AND ";
            }
            stringWhere += values[i].where[values[i].where.length-1].whereKey + "=" + values[i].where[values[i].where.length-1].whereValue;

            var sqlUpdate = "UPDATE " + table + " SET " + values[i].key + "=" + values[i].value + " WHERE " + stringWhere;
            this.connection.query(sqlUpdate, function(err, result) {
                let tabResult = {};
                if (err) {
                    tabResult["success"] = false;
                    tabResult["msg"] = "update failed";
                    callback(tabResult);
                } else if (i == values.length-1) {
                    tabResult["success"] = true;
                    callback(tabResult);
                }
            }.bind(i));
        }
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

    getData(column, table, params, callback) {
        var sqlData = "SELECT "+column+" FROM "+table+" WHERE ?";
        this.connection.query(sqlData, params, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["success"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["success"] = true;
                tabResult["result"] = result;
            }
            callback(tabResult);
        });
    }

    getDataWithEmpty(column, table, params, callback) {
        let stringWhere = "";

        for (let i=0; i < Object.entries(params).length-1; i++) {
            stringWhere += Object.entries(params)[i][0]+"="+Object.entries(params)[i][1]+ " AND "
        }

        stringWhere += Object.entries(params)[Object.entries(params).length-1][0]+"="+Object.entries(params)[Object.entries(params).length-1][1]
        var sqlData = "SELECT "+column+" FROM "+table+" WHERE "+stringWhere;
        this.connection.query(sqlData, params, function(err, result) {
            let tabResult = {};
            if (err) {
                tabResult["success"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["success"] = true;
                tabResult["result"] = result;
            }
            callback(tabResult);
        });
    }

    getDataWithoutParams(column, table, callback) {
        var sqlData = "SELECT "+column+" FROM "+table;
        this.connection.query(sqlData, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["success"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["success"] = true;
                tabResult["result"] = result;
            }
            callback(tabResult);
        });
    }

    getDataMultipleWhere(column, table, columnWhere, params, callback) {
        var sqlData = "SELECT "+column+" FROM "+table+" WHERE "+columnWhere+" in ("+params.toString()+")";
        this.connection.query(sqlData, params, function(err, result) {
            let tabResult = {};
            if (err || !result[0]) {
                tabResult["success"] = false;
                tabResult["msg"] = err;
            } else {
                tabResult["success"] = true;
                tabResult["result"] = result;
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
        let stringWhere = "";
        
        for (let i=1; i < tableArray.length; i++) {
            stringJoin += this.joinMethod[indexJoinMethod]+tableArray[i]+" ON "+onArray[i-1];
        }

        for (let i=0; i < params.length-1; i++) {
            stringWhere += params[i]+" AND ";
        }
        stringWhere += params[params.length-1];

        var sqlData = "SELECT "+columnArray.join(', ')+" FROM "+tableArray[0]+stringJoin+ " WHERE "+stringWhere;
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

    getDataWithJoinMultipleWhere(columnArray, tableArray, onArray, indexJoinMethod, columnWhere, params, callback) {
        let stringJoin = "";

        for (let i=1; i < tableArray.length; i++) {
            stringJoin += this.joinMethod[indexJoinMethod]+tableArray[i]+" ON "+onArray[i-1];
        }

        var sqlData = "SELECT "+columnArray.join(', ')+" FROM "+tableArray[0]+stringJoin+ " WHERE "+columnWhere+" in ("+params.toString()+")";
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