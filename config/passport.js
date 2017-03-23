const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');

const User          = require('../models/user-model');

module.exports = function (passport) {
  passport.use(new LocalStrategy((username, password, next) => {
    // this is the logic for matching log in credentials
    user.find({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: 'Incorrect username'});
        return;
      }

      const didPasswordMatch = bycrypt.compareSync(password, foundUser.encryptedPassword);

      if (!didPasswordMatch) {
        next(null, false, { message: 'Incorrect username' });
        return;
      }

      next(null, foundUser);
    });
  }));

// with this we are getting id of user session and we can use the id to then use db queries
  passport.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
  });

  paspport.deserializeUser((userIdFromSession, cb) => {
    User.findById(userIdFromSession, (err, userDocument) => {
      if (err) {
        cb(err);
        return;
      }

      // Here is where we put in queries to display in every page using users data.

      cb(null, userDocument);
    });
  });
};
