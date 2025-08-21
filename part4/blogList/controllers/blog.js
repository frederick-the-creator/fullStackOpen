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


  const validation = jwt.verify(request.token, process.env.SECRET)


  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  // Create blog
  const user = await User.findById(validation.id)


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
  console.log('delete route hit')
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    console.log('request', request)
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, {new:true})
    console.log('result', result)
    response.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter