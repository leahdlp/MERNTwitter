const mongoose = require("mongoose");
const express = require("express");
const app = express();
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));

// these calls can be trigger by either running "node app.js" or "node app"

// the content that comes up in our broswer upon request type
app.get("/", (requestObj, responseObj) => {
    responseObj.send("Hello Bitch nigga");
})

// the "localhost"/server we go to in our browser
const port = process.env.PORT || 5000;

// we see this console.log in server and see hello world in broswer
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// these functions will run server with proper browser content but do not watch
// file for changes... nodemon listens for changes and will watch so that it can
// restart server for us upon changes