const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const testRouter = require('./controllers/test')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

console.log('Mongoos URI: ',config.mongoUrl)

mongoose.connect(config.mongoUrl)
    .then(() => {
        console.log('Mongo DB connection successfully established')
    })
    .catch((error) => {
        console.log('Error:', error.message)
    })

app.use(express.json())
app.use(middleware.getTokenFromRequest)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)


app.use('/api/testing', testRouter)


app.use(middleware.errorHandler)

module.exports = app