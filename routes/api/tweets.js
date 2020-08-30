const express = require("express");
const router = express.Router();
const passport = require("passport");
// require("./passport")(passport);
const validateTweetInput = require('../../validation/tweets');
const Tweet = require('../../models/Tweet');

router.get("/test", (req, res) => {
  res.json({ map: "This is the tweet route" });
});

router.post("/", 
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateTweetInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newTweet = new Tweet({
      user: req.user.id,
      text: req.body.text
    })
  }
)

module.exports = router;
