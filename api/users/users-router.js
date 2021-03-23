const express = require('express')
const router = express.Router()
const User = require('./users-model')

function verification(req, res, next) {
    if (req.session && req.session.user) {
        next()
    } else {
        res.status(401).json({
            message: 'You shall not pass!.'
        })
    }
}

router.get('/', verification, (req, res) => {
    User.find()
      .then(users => {
          res.status(200).json(users)
      })
      .catch(err => {
          res.status(500).json({
              message: err.message
          })
      })
})

module.exports = router;