const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const User = require('../users/users-model')

router.post('/register', (req, res) => {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 10)
    const newUser = { username, password: hash}

    User.insert(newUser)
      .then(user => {
          res.status(201).json(user)
      })
      .catch(err => {
          res.status(500).json({
              message: err.message
          })
      })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    User.findBy({username})
      .first()
      .then(user => {
          if(user && bcrypt.compareSync(password, user.password)) {
              req.session.user = user
              res.status(200).json({
                  message: 'Welcome back!'
              })
          } else {
              res.status(401).json({
                  message: 'Invalid credentials'
              })
          }
      })
      .catch(err => {
          res.status(500).json({
              message: err.message
          })
      })
})

router.get('/logout', (req, res) => {
    if(req.session && req.session.user) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({
                    message: err.message
                })
            } else {
                res.status(200).json({
                    message: 'Bye! Hope to see you soon!'
                })
            }
        })
    } else {
        res.json({
            message: 'You are not currently logged in'
        })
    }
})

module.exports = router;