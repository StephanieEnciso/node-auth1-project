const express = require('express');

const router = express.Router();

const Users = require('./users-model');

const authVerification = (req, res, next) => {
    if(req.session && req.session.user) {
        next()
    } else{
        res.status(401).json('unauthorized')
    }
}

router.get('/', authVerification, (req, res) => {
    Users.find()
      .then(users => {
         res.status(200).json(users);
      })
      .catch(err => {
          res.send(err);
      })
});

module.exports = router;