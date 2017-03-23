const express = require('express');
const passport = require('bcrypt');
const bcrypt = require('bcrypt');

const User = require('../models/user-model');

const authRoutes = express.Router();

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const nickname = req.body.nickname;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide a username and password.'});
    return;
  }

  User.findOne({ username }, '_id', (err, foundUser) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong. Our bad.'});
      return;
    }

    if(foundUser) {
      res.status(400).json({ mesage: 'The username already exists.' });
      return;
    }

    const salt = bcrypt.genSaltSyc(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const theUser = new User({
      username,
      nickname,
      encryptedPassword: hashPass,
    });

    theUser.save((err) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
        return;
      }

// Ensured login do redirects which in this case wpuld fuck up. No need in api.
// Registers the user automatically, if I understood correctly.
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong.' });
        }

        res.status(200).json(req.user);
      });
    });
  });
});

autRoute.post('/login', (req, res, next) => {
  const passportFunction = passport.authenticate('local',
    (err, theUser, failDetails) => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong.' });
      }
      if (!theUser) {
        res.status(401).json(failureDetails);
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          req.status(500).json({ message: 'Something went wring'});
          return;
        }

        res.status(200).json(req.user);
      });
    }
  );

});

passportFunction(req, res, next);

authRoutes.post('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({message: 'Success'});
});

// This if statement is required for any routes that required being logged.
// This will part of any request. if (req.!isAthenticated())   is false or not logged in we kick the user out.
//
authRoutes.get('/loggedin', (req, res, next) => {
  if (req.isAthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(401).json({ message: 'Unauthorized.' });
});


// This is a way to validate with a fucntion or refractor and then plug into the follwoing authRoutes.
// This can be done with other functions.
// Use something like this to validate the bees and farms?
function getOut (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403).json({ message: 'FORBIDDEN' });
    return;
  }

  next();
}

authRoutes.get('/private', getOut, (req, res, next) => {
    res.json({ message: 'FORBIDDEN' });
});
//
// authRoutes.get('/private', (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     res.status(403).json({ message: 'FORBIDDEN' });
//     return;
//   }
// });

module.exports = authRoutes;
