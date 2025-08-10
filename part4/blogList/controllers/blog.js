const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user')
  response.json(blogs)
})

blogRouter.post('', async (request, response) => {

  // Retrieve token from body and validate
  const authorisation = request.headers['authorization'].replace('Bearer ','')

  const validation = jwt.verify(authorisation, process.env.SECRET)

  if (!validation) {
    response.status(401).json({error:'Invalid token'})
  }

  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  // Create blog
  const users = await User.find({})
  const user = users[0]
  newBlog = {
    ...request.body,
    user: user._id
  }
  const blog = new Blog(newBlog)
  const result = await blog.save()

  await User.findByIdAndUpdate(user._id, { blogs: result._id }, { new:true } )

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndUpdate('5a422a851b54a676234d17f7', request.body, {new:true})
    response.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter