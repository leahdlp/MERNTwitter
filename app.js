const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db = require("./config/keys").mongoURI;
const passport = require('passport');
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const User = require("./models/User");
const bodyParser = require("body-parser");

// connecting to our database and receiving feedback when done successfully or not
// successfully
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));

// telling our app we want it to respond to requests from other software like 
// postman
app.use(bodyParser.urlencoded({
  extended: false,
}))

// telling our app we want it to respond to JSON requests
app.use(bodyParser.json());
// these calls can be trigger by either running "node app.js" or "node app"

// the content that comes up in our broswer upon request type
// app.get("/", (requestObj, responseObj) => {
//     // create a new user with new keyword and invoking model with object full of
//     // required attributes
//     // const user = new User({
//     //   handle: "jim", 
//     //   email: "jim@jim.jim",
//     //   password: '12345678'
//     // })
//     // save the user
//     // user.save()
//     responseObj.send("Hello Friends");
// })

app.use(passport.initialize());
require('./config/passport')(passport);

// first argument is the request route starting with these specifications, the 
// second argument is the object we'ld give in response?
app.use("/api/users", users);
app.use("/api/tweets", tweets);

// the "localhost"/server we go to in our browser
const port = process.env.PORT || 5000;

// we see this console.log in server and see hello world in broswer
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// these functions will run server with proper browser content but do not watch
// file for changes... nodemon listens for changes and will watch so that it can
// restart server for us upon changes

