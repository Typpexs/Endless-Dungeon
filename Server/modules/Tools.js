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
            expiresIn: '6h'
        });
    }

    parseAuthorization(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    }

    getUserId(authorization) {
        let userId = -1;
        let token = this.parseAuthorization(authorization);
        if (token != null) {
            //let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                userId = jwtToken.userId;
            } catch(err) {
                return -1;
              }
        }
        return userId;
    }


    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }

    generateRandomLvl(min, max) {
        let tabLvl = [];
        while (min <= max) {
            if (max - min > 7) {
                for (let i=0; i < 100; i++) {
                    tabLvl.push(min); 
                }
            } else if (max - min > 5) {
                for (let i=0; i < 50; i++) {
                    tabLvl.push(min); 
                }
            } else if (max - min > 3) {
                for (let i=0; i < 20; i++) {
                    tabLvl.push(min); 
                }
            } else if (max - min >= 2) {
                for (let i=0; i < 10; i++) {
                    tabLvl.push(min); 
                }
            } else {
                for (let i=0; i < 5; i++) {
                    tabLvl.push(min); 
                }
            }
            min++;
        }
        tabLvl = this.shuffle(tabLvl);
        return (tabLvl[this.getRandomIntInclusive(0, tabLvl.length-1)]);
    }
};