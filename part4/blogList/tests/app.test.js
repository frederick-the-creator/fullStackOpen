const { test, describe, beforeEach, after} = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
        const passwordHash = await bcrypt.hash('Ping', 10)
        const user = {
            _id: "5a422a851b54a676234d17b4",
            username: "frederickl1",
            name: "Fred",
            passwordHash: passwordHash,
            __v: 0
        }
        await User.insertOne(user)
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

const userLogin = async (valid) => {

    const pass = (valid === 'yes')
        ? 'Ping'
        : 'Pong'

    // Login
    const user = {
        userName: 'frederickl1',
        password: pass
    }

    const loginResult = await api
        .post('/api/users/login')
        .send(user)

    const token = loginResult.body.token

    return token

}

describe('POST requests', async () => {
    test('create new blog authorised', async () => {

        const token = await userLogin('yes')

        // Create blog object
        const startBlogs = await helper.retrieveAllBlogs()

        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        // Send request
        console.log('token: ', token)
        const result = await api
            .post('/api/blogs')
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        const finalBlogs = await helper.retrieveAllBlogs()
        assert.strictEqual(finalBlogs.length, startBlogs.length + 1)

        const titles = finalBlogs.map(blog => blog.title)

        assert(titles.includes("Fred's secret life of cooombs"))

    })
    test('create new blog unauthorised', async () => {


        const token = 'abcd'

        // Create blog object
        const startBlogs = await helper.retrieveAllBlogs()

        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        // Send request

        const result = await api
            .post('/api/blogs')
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(401)
        
        console.log('error body',result.body)


    })
    test('token middleware testing', async () => {
        
        const token = await userLogin('yes')

        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        // Send request

        const result = await api
            .post('/api/blogs')
            .set("Authorization", `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

    })
    test('missing likes property', async () => {

        const token = await userLogin('yes')

        const newBlog =   {
            title: "Missing Likes",
            author: "Michael Chan",
            url: "https://fredslife.com/",
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        const finalBlogs = await helper.retrieveAllBlogs()
        const retrievedBlog = finalBlogs.find(blog => blog.title === 'Missing Likes')

        assert.strictEqual(retrievedBlog.likes, 0)
        // console.log(finalBlogs)


    })
    test('missing title property', async () => {

        const token = await userLogin('yes')
        
        const newBlog = {
            author: "Michael Chan",
            url: "https://fredslife.com/",
        }

        await api
            .post('/api/blogs')
            .set('Authorization' ,`Bearer ${token}`)
            .send(newBlog)
            .expect(400)
        
    })
    test('missing url property', async () => {

        const token = await userLogin('yes')

        const newBlog =   {
            title: "Missing Likes",
            author: "Michael Chan",
        }

        await api
            .post('/api/blogs')
            .set('Authorization' ,`Bearer ${token}`)
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

        const token = await userLogin('yes')

        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
        
        await api
            .get('/api/blogs')
            .expect(200)

    })
    test('Add new blog and fetch users to display blog info', async () => {

        const token = await userLogin('yes')

        const newBlog =   {
            title: "Fred's secret life of cooombs",
            author: "Michael Chan",
            url: "https://fredslife.com/",
            likes: 100,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
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