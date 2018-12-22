var mysql = require('mysql');

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
            let tabError = {};
            if(err) {
                tabError["succes"] = false;
                tabError["msg"] = err;
                callback(tabError);
            } else {
                tabError["succes"] = true;
                callback(tabError);
            }
        });
    }
};