const fs = require('fs');
const express = require('express')
const morgan = require('morgan')

const { router: usersRouter,
    saveUsersData
} = require('./routes/users'); 

const srv = express()


const jsonBodyParser = express.json()

srv.use(jsonBodyParser)

srv.listen(3000, () => console.log('espress server is running [3000]'))

srv.use(morgan(':method :url :status '))

srv.use('/users', usersRouter)

process.on('SIGINT', () => {
    saveUsersData();
    process.exit();
});

