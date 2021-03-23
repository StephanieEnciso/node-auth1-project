const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');

const server = express();

const config = {
    name: 'sessionId',
    secret: 'keep it secret',
    cookie:{
        maxAge: 1000 * 10 * 1000,
        secure: false,
        httpOnly: false,
    },

    resave: false,
    saveUninitialized: false,

    store: new KnexSessionStore({
        knex: require('../database/connection'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    })
}

server.use(session(config))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use("/api/users", usersRouter);

module.exports = server;