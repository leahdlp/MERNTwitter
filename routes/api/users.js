const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require("../../validation/login")

router.get("/test", (req, res) => {
    res.json({ map: "This is the user route" });
})

// basically our controller
// on the register route we take the request and in the body should be user
// attributes (the same way we do body instead of params in postman)
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
    // we find the user by the email attribute given in the request body
    User.findOne({ email: req.body.email })
        .then(user => {
            // if said user exists we give a response with a status 400 error and
            // a json statement specific to the email error
            if (user) {
                return res.status(400).json({ email: "A user is already registered with that email" })
            } else {
                // if the user does not exist in our db we go ahead and create the
                // user using our User model and passing in the attributes given
                // in the request body
                const newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email,
                    // need to use Bcrypt to avoid saving plaintext password to db
                    password: req.body.password
                })

                // once we have new user's password we need to salt it with built
                // in bcrypt method
                // takes in two arguments, the number of times we want to pass it
                // through the hashing function, and a callback
                // cb takes in two arguments, an error (if one occurs), and the salt
                // we get back from the built in
                bcrypt.genSalt(10, (err, salt) => {
                    // hashing function takes in 3 arguments... the password
                    // and the salt we just got back and what we want it to do
                    // after it is successfully hashed
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // if there is an error then we throw it
                        if (err) throw err;
                        // otherwise, reset db password to be our encrypted/hashed
                        // password 
                        newUser.password = hash
                        // after hashing it is safe to save our user to our db
                        // after we save the user we send it to the frontend
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                            // can also say res.send but we know user is a json 
                            // object so we might as well do this ^
                            // if there is an error saving then console.log
                    })
                })
            }
        })
})

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
    

    // get email and password from request body
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({ email: email })
        .then(user => {
            // if user was not found give appropriate error
            if (!user) {
                return res.status(404).json({ email: "This user does not exist" })
            }

            // if we found user then we use built in bcrypt method to verify 
            // password... returns boolean that says if it is a match
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    // if the password is a match we give a success message
                    // if password isn't a match we give an error
                    if (isMatch) {
                        const payload = {
                            id: user.id,
                            handle: user.handle,
                            email: user.email,
                        }
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            }
                        )

                    } else {
                        return res.status(400).json({ password: "Incorrect Password" })
                    }
                })
        })
})

module.exports = router;

