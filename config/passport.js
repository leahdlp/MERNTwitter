// tells passport we want to use this strategy for handling json web tokens
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const options = {};
// using built in passport method that extracts json web token from the header in 
// the way that we want it
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// what we compare the jwtFromRequest against
options.secretOrKey = keys.secretOrKey;

// exporting an anonymous function that takes in a passport
module.exports = passport => {
    // telling the passport to use the appropriate strategy... strategy takes in
    // our options hash with token and key as well as a callback
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => console.log(err))
        // tells middleware to hand off to next middleware key
        // done();
    }))
}
