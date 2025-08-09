const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const config = require('./utils/config')

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
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

module.exports = app