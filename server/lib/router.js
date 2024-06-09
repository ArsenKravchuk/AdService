const { timeStamp } = require('console');
const express = require('express');
const User = require('../models/user');
const { validate } = require('validate.js');
const passport = require('passport');

let _ = express.Router();

_.post('/register', async (req, res) => {
    try {

        const { username, password} = req.body;

        let user = new User();
        
        let msg = user.setUserName(username);
        if(msg) return res.status(400).json({
            error: {
                code: 400,
                type: 'username',
                message: msg
            }
        });


        msg = await user.setPassword(password);
        if(msg) return res.status(400).json({
            error: {
                code: 400,
                type: 'password',
                message: msg
            }
        });


        user.save();

        res.status(200).json({
            timeStamp: Date.now(),
            msg: 'Registered',
            'user': user,
            code: 200
        });
    } catch(e) {
        throw new Error(e);
    }
});

// _.post('/login', async(req,res) => {
//     try {
//         res.status(200).json({
//             timeStamp: Date.now(),
//             msg: 'Log in ok',
//             code: 200
//         })
//     } catch(e) {
//         throw new Error(e);
//     }
// });


_.post('/login', async (req, res, next) => {
    console.log(`1 Login handler ${JSON.stringify(req.body)}`);
    passport.authenticate('local', 
        (err,user)=> {
            console.log(`3 Passport auth callback ${JSON.stringify(user)}`);

            if(err) {
                return res.status(401).json({
                    timeStamp: Date.now(),
                    msg: `Access denied. Username or password is incorrect`,
                    code: 401,
                });
            };

            if(!user) {
                return res.status(401).json({
                    timeStamp: Date.now(),
                    msg: `Access denied. User not found`,
                    code: 401,
                });
            };

            req.logIn(user, (err) => {
                if(err) {
                    return next(err);
                }
                res.status(200).json({
                    redirectTo: '/profile'
                });
            })

            
        
    })(req,res,next);
});


_.get('/user', async (req, res) => {
    try {

        console.group('\n GET /user - request details: ');
            console.log('------------------\n');
            console.log('req.body', req.body);
            console.log('req.params', req.params);
            console.log('req.header', req.headers);
            console.log('req.isAuthenticated', req.isAuthenticated());
            console.log('req.user', req.user);
        console.groupEnd();

        res.sendStatus(200);
    } catch(e) {
        console.error(new Error(e.message));
        res.status(500).json({
            timeStamp: Date.now(),
            msg: `Failed to get user, internal server error`,
            code: 500
        });
    }
});

_.post('/logout', async(req,res) => {
    try {
        res.status(200).json({
            timeStamp: Date.now(),
            msg: 'Logout ok',
            code: 200
        })
    } catch(e) {
        throw new Error(e);
    }
});

_.all('*', async(req,res) => {
    try {
        res.status(404).json({
            timeStamp: Date.now(),
            msg: 'no root matches your request',
            code: 404
        })
    } catch(e) {
        throw new Error(e);
    }
});



module.exports = _;
