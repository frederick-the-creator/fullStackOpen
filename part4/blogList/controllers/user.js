const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userRouter.get('', async (request, response, next) => {
    console.log('Get route hit')
    const result = await User
        .find({})
        .populate('blogs')
    response.status(200).json(result)
})

userRouter.post('/registration', async (request, response, next) => {
    console.log('User Registration route hit')
    // Route for user registration

    // Error hanlding username and password must be present and > 3 long - status code and error message
    // Test invalid user creation

    console.log(request.body)
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

userRouter.post('/login', async (request, response, next) => {


    const { userName, password } = request.body


    const user = await User.findOne({username:userName}).exec()

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
        return response.status(401).end()
    }

    userToken = user.toJSON()

    const token = jwt.sign(userToken, process.env.SECRET)

    console.log('toke', token)

    response
    .status(200)
    .send({ token , ...userToken})

})

module.exports = userRouter