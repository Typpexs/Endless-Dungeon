var express = require('express');
var home = express.Router();
var bodyParser = require('body-parser');
var toolsModule = require('../modules/Tools');
let tools = new toolsModule();

home.use(bodyParser.json());
home.use(bodyParser.urlencoded({ extended: true }));

module.exports = class Home {
    constructor(db = null) {
        this.db = db;
        this.initRoutes();
    }

    get routes() { return home; }

    initRoutes() {
        home.get('/', function(req, res) {
            let userId = tools.getUserId(req.headers['authorization']);
            res.status(200).json({
                'success': 'true',
                'home': 'c est la maison'
            });
        }.bind(this));
    }
};