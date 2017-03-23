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

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong.' });
        }

        res.status(200).json(req.user);
      });
    });
  });
});

module.exports = authRoutes;
