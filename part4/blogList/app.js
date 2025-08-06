const express = require('express')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')

const app = express()

const mongoUrl = "mongodb+srv://blogListUser:LfLHC8mTjzmIURnc@cluster0.zlwz79c.mongodb.net/blogListApp?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app