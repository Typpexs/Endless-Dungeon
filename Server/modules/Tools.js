var bcrypt = require('bcrypt');

module.exports = class Tools {
    getDateNowForMysql() {
        let date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2); 
        return date;
    }

    encryptString(stringToEncrypt) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(stringToEncrypt, salt);
    }

    compareEncryptString(stringToCompare, stringEncrypt, callback) {
        bcrypt.compare(stringToCompare, stringEncrypt, function(err, res) {
            if (res) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
};