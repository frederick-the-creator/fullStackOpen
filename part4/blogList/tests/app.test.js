const { test, describe, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')

const api = supertest(app)

// Initialise the test database
beforeEach(async () => {
    try {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    } catch (error) {
        console.log('Error in beforeEach', error.message)
        throw error
    }

    try {
        await User.deleteMany({})
        await User.insertMany(helper.initialUsers)
    } catch (error) {
        console.log('Error in beforeEach', error.message)
        throw error
    }

})

describe('GET requests', async () => {
    test('unique identifier is id', async () => {
        const response = await api
            .get('/api/blogs')
        assert(response.body[0].id)
    })
    test('returns JSON', async () => {
        // Call the request, along with expect
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('returns expected number of posts', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
})

describe('POST requests', async () => {
    test('create new blog', async () => {
        const startBlogs = await helper.retrieveAllBlogs()
        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }
        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const finalBlogs = await helper.retrieveAllBlogs()
        assert.strictEqual(finalBlogs.length, startBlogs.length + 1)

        const titles = finalBlogs.map(blog => blog.title)

        assert(titles.includes("Fred's secret life of cooombs"))

    })
    test('missing likes property', async () => {

        const newBlog =   {
            title: "Missing Likes",
            author: "Michael Chan",
            url: "https://fredslife.com/",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const finalBlogs = await helper.retrieveAllBlogs()
        const retrievedBlog = finalBlogs.find(blog => blog.title === 'Missing Likes')

        assert.strictEqual(retrievedBlog.likes, 0)
        // console.log(finalBlogs)


    })
    test('missing title property', async () => {
        const newBlog = {
            author: "Michael Chan",
            url: "https://fredslife.com/",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
    })
    test('missing url property', async () => {
        const newBlog =   {
            title: "Missing Likes",
            author: "Michael Chan",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
    })
})

describe('DELETE requests', async () => {
    test('single blog post delete', async() => {
        const startBlogs = await helper.retrieveAllBlogs()
        const deleteId = "5a422a851b54a676234d17f7"

        await api
            .delete(`/api/blogs/${deleteId}`)
            .expect(204)

        const finalBlogs = await helper.retrieveAllBlogs()

        const finalBlogsIds = Array.from(finalBlogs, blog => blog.id)

        assert(finalBlogs.length, startBlogs.length - 1)
        assert(!finalBlogsIds.find(blogId => blogId === deleteId))
    })
})

describe('PUT requests', async () => {
    test('updating the likes', async () => {
        const startBlogs = await helper.retrieveAllBlogs()
        const updatedBlog = {...startBlogs[0], likes: 130}

        await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updatedBlog)
            .expect(200)

        const finalBlogs = await helper.retrieveAllBlogs()

        const finalUpdatedBlog = Array.from(finalBlogs).find(blog => blog.id === updatedBlog.id)

        assert.strictEqual(finalUpdatedBlog.likes, 130)
        
    })
})

describe('Blog and User referencing', async () => {
    test('Add new blog and return all blogs with the user details', async () => {

        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
        
        await api
            .get('/api/blogs')
            .expect(200)
    })
    test('Add new blog and fetch users to display blog info', async () => {
        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
        
        const result = await api
            .get('/api/users')
            .expect(200)


        assert.strictEqual(result.body[0].blogs.title, newBlog.title)
    })
})

after(async () => {
    try {
        await mongoose.connection.close()
    } catch (error) {
        console.log('error in app.test.js closing mongoose connection:', error.message)
        throw error
    }
})