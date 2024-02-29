const yup = require('yup');
const router = require('express').Router()
const fs = require('fs');

const knexLib = require('knex');

const knexConfig = require('../knexfile');
const knex = knexLib(knexConfig);

async function getAllUsers() {
    const data = await knex.select().from('users')
    console.log(data);
    return  data 
}

const validateUserId = (userId) => {
    if (!Number.isInteger(userId) || userId < 0) {
        throw new Error('Not valid user id');
    }
}

const userValidation = async (req, res, next) => {
    const schema = yup.object({
        username: yup.string().required(),
        email: yup.string().email().required(),
    });
    try {
        await schema.validate(req.body);
        next()
    } catch (error) {
        res.status(400).send(error.message);
    }
};

router.post('/', userValidation, async (req, resp) => {
    try {
        const user = { ...req.body }
        const result = await knex('users').insert(user)
        const id = result[0]; 
        const savedUser = { id: id, ...user }; 
        resp
            .status(200)
            .send(savedUser)
    } catch (err) {
        resp.send(400, err.message)
        return
    }
})

router.get('/', async (req, resp) => {
    const users = await getAllUsers()
    resp
        .status(200)
        .send(users)
})

router.get('/:userid', async (req, resp) => {
    const id = +req.params.userid;
    try {
        validateUserId(id)
        const userDB = await knex.select().from('users').where({ id }).first();
        userDB ? resp.status(200).send(userDB) : resp.status(404).send('User not found');
    } catch (err) {
        resp.send(400, err.message)
        return
    }
    
})

router.delete('/:userid', async (req, resp) => {
    const id = +req.params.userid
    try {
        validateUserId(id)
        const deletedCount = await knex('users').where({ id }).del()
        deletedCount ? resp.status(204).send('User deleted') : resp.status(404).send('User not found') 
    } catch (err) {
        resp.send(400, err.message)
        return
    }
})

module.exports = {
    router,
}