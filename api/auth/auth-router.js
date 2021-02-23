const express = require('express');

const router = express.Router();

const User = require('../users/users-model');
const bcrypt = require('bcryptjs');

const validateReq = (req, res, next) => {
    if(!req.body.username || !req.body.password) {
        res.status(401).json({
            message: 'Missing username or password'
        })
    } else {
        next()
    }
}

const isUserinDb = async (req, res, next) => {
    try{
        const rows = await User.findBy({username: req.body.username})
        if(!rows.length){
            next()
        } else {
            res.status(401).json({
                message: 'Username already exists'
            })
        }
    } catch(err) {
        res.status(500).json({
            message: `Server error: ${err}`
        })
    }
}

const verifyUserExists = async (req, res, next) => {
    try{
        const rows = await User.findBy({username: req.body.username})
        if(rows.length) {
            req.userData = rows[0]
            next()
        } else {
            res.status(401).json({
                message: 'Login error, check credentials'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Server error: ${err}`
        })
    }
}

router.post('/register', validateReq, isUserinDb, async (req, res) => {
    try{
        const hash = bcrypt.hashSync(req.body.password, 10)
        const newUser = await User.insert({username: req.body.username, password: hash})
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({
            message: `Server error: ${err.message}`
        })
    }
})

router.post('/login', validateReq, verifyUserExists, (req, res) => {
    try{
        const verification = bcrypt.compareSync(req.body.password, req.userData.password)
        if(verification) {
            req.session.user = req.userData
            res.json(`Welcome back ${req.userData.username}`)
        } else {
            res.status(401).json({
                message: 'Username and/or password are incorrect'
            })
        }
    } catch(err) {
        res.status(500).json({
            message: `Server error: ${err.message}`
        })
    }
})

module.exports = router;