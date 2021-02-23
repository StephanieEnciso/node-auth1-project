const db = require('../../database/connection');

module.exports = {
    find,
    findBy,
    insert,
    findById
}

function find() {
    return db('users').select('id', 'username').orderBy('id');
}

function findBy(userObj) {
    return db('users').where(userObj).orderBy('id')
}

async function insert(user) {
    const [id] = await db('users').insert(user, 'id');
    return findById(id);
}

function findById(id) {
    return db('users').where({id}).first();
}