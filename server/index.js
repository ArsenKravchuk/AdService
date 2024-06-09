const express = require('express');
const router = require('./lib/router')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');
const DB = require('./lib/db');
const bcrypt = require('bcrypt');
const { rejects } = require('assert');


const app = express();
const port = process.env.PORT || 3000;

let _ = {}

_.start = () => {
    try {
        app.listen(port);
        console.log(`Express server listening on ${port}`);
    } catch(e) {
        throw new Error(e);
    }
}

// cookie session middleware needs to be registred before rest
app.use(cookieSession({
    name: 'ad-service-auth',
    keys: ['secret-new', 'secret-old'],
    maxAge: 60 * 60 * 24
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser( (user, done) => {
    console.log(`4 Serialize user: ${JSON.stringify(user.id)}`);
    return done(null, user.id);
});

passport.deserializeUser((id,done)=> {
    console.log(`Deserializing user: ${id}`);
    const user = DB.findById(id);
    if(user) {
        return done(null,{id: user.id, username: user.username});
    } else {
        return done(new Error('No user with id is found'), null);
    }
})

passport.use('local', new LocalStrategy({ passReqToCallback: true},
    async (req, username, password, done) => {
    console.log(`2 Local stategy verify callback ${JSON.stringify(username)}`);

    let user = DB.findByUserName(username);
    if(!user) {
        return done(null, false);
    }

    // Compare incoming password to stored password
    // using bcrypt
    const result = await new Promise((resolve, reject)=> {
        bcrypt.compare(password, user.security.passwordHash, (err, res) => {
            if(err) reject(err);
            resolve(res);
        });
    });
    

    if(result) {
        return done(null, user);
    } else {
        return done('Password or username is incorrect. Please try again', null);
    }
}));

app.use('/api', router);

_.start();