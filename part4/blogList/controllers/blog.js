const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('', async (request, response) => {

  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  }

  const blog = new Blog(request.body)

  const result = await blog.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

})

blogRouter.put('/:id', async (request, response) => {
  try {
    const result = await Blog.findByIdAndUpdate('5a422a851b54a676234d17f7', request.body, {new:true})
    response.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter