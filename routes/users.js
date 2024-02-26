const yup = require('yup');
const router = require('express').Router()
const fs = require('fs');

let usersData

const validateUserId = (userId) => {
    if (!Number.isInteger(userId) || userId < 0) {
        throw new Error('Not valid user id');
    }
}

fs.readFile('./assets/users.json', 'utf-8', (err, content) => {
    if (err) throw err;
    usersData = JSON.parse(content);
});

function saveUsersData() {
    const data = JSON.stringify(usersData, null, 2);
    try {
        fs.writeFileSync('./assets/users.json', data, 'utf-8');
        console.log('Users data has been saved.');
    } catch (err) {
        console.error('Error writing to users.json:', err);
    }
}

router.post('/', async (req, resp) => {
    const schema = yup.object({
        username: yup.string().required(),
        email: yup.string().email().required(),
    });
    try {
        const data = await schema.validate(req.body)
        usersData.push({ 'userId': usersData.length, ...req.body })
        resp.send(200, 'successfully added')
    } catch (err) {
        resp.send(400, err.message)
        return
    }

})

router.get('/', (req, resp) => {
    const jsonData = usersData
    resp
        .status(200)
        .send(jsonData)
})

router.get('/:userid', (req, resp) => {
    const userId = +req.params.userid;

    try {
        validateUserId(userId)
        const user = usersData.find(user => user.userId === userId);
        user ? resp.status(200).send(user) : resp.status(404).send('User not found')
 
    } catch (err) {
        resp.send(400, err.message)
        return
    }

})

router.delete('/:userid', (req, resp) => {
    const userId = +req.params.userid
    
    try {
        validateUserId(userId);
        const index = usersData.findIndex(user => user.userId === userId)
        if (index !== -1) {
            usersData.splice(index, 1)
            resp.status(204).send('User deleted')
        } else {
            resp.status(404).send('User not found')
        }
    } catch (err) {
        resp.send(400, err.message)
        return
    }
})

module.exports = {
    router,
    saveUsersData
}