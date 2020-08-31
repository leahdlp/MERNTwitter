const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose has a built in schema... now we need to tell mongoose what it means 
// to be a user in our app... we define our schema to do so giving user attributes

const UserSchema = new Schema({
    handle: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    } 
    // timestamps: true
});

// after we create schema we will use mongoose's built in model function passing
// in the name of our model as well as our schema for the model... then export it!
const User = mongoose.model('users', UserSchema);
module.exports = User;