const {v4:uuidv4} = require('uuid');
const validate = require('validate.js');
const constraints = require('../lib/constraints');
const bcrypt = require('bcrypt');
const DB = require('../lib/db');


let _ = class User {
    constructor() {
        this.created = new Date();
        this.id = uuidv4();
        this.username = null;
        this.security = {
            passwordHash : null
        };

    };

    save () {
        DB.save(this);
        console.log(`User saved ${this.username} to db`);
    };

    findUserById(id) {
        return '';
    };

    setUserName(username) {

        try {
            if (username) {
                username = username.trim();
            };
            
            let msg = validate.single(username, constraints.username);

            if(msg) {
                return msg;
            } else {
                this.username = username;
                return;
            }
            
        } catch(e) {
            throw new Error(e);
        }

        
    };

    async setPassword(password) {
        try {

            console.log('Password: ', password);
            let msg = validate.single(password, constraints.password);

            if(msg) {
                return msg;
            } else {
                this.security.passwordHash = await bcrypt.hash(password,10);
                return;
            }
        } catch(e) {
            throw new Error(e);
        }
    };
};

module.exports = _;