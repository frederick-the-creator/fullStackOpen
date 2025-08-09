const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('', async (request, response, next) => {
    const result = await User
        .find({})
        .populate('blogs')
    response.status(200).json(result)
})

userRouter.post('', async (request, response, next) => {

    // Error hanlding username and password must be present and > 3 long - status code and error message
    // Test invalid user creation

    if (!request.body.username || !request.body.password) {
        return response.status(400).send({error: 'username or password missing'})
    }

    if (request.body.username.length < 3 || request.body.username.length < 3 ) {
        return response.status(400).send({error: 'username and password must be at least 3 charaacters long'})
    }

    // Error handling such as duplicate user, 
    // Error handling middleware update for duplicate user

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

    // Check this 
    request.body.passwordHash = passwordHash
    delete request.body.password

    const user = new User(request.body)

    try {
        const result = await user.save()
        response.status(201).json(result)
    } catch (error) {
        console.log('error', error.message)
        next(error)
    }

})

module.exports = userRouter