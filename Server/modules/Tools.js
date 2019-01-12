var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0123456789azerty';

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

    generateTokenForUser(userData) {
        return jwt.sign({
            userId: userData.id
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        });
    }

    parseAuthorization(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    }

    getUserId(authorization) {
        let userId = -1;
        let token = this.parseAuthorization(authorization);
        if (token != null) {
            let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
            if (jwtToken != null)
                userId = jwtToken.userId;
        }
        return userId;
    }
};