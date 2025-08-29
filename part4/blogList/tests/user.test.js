const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const User = require('../models/user')
const mongoose = require('mongoose')
const api = supertest(app)
const bcrypt = require('bcrypt')


beforeEach(async () => {
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
})


describe('POST', async () => {
    test('create new user', async () => {
        const initialUsers = await helper.retrieveAllUsers()

        const newUser = {
            username: 'gaia3',
            name: 'Gaia',
            password: 'smoke'
        }

        await api
            .post('/api/users/registration')
            .send(newUser)
            .expect(201)
        
        const finalUsers = await helper.retrieveAllUsers()

        assert.strictEqual(initialUsers.length, finalUsers.length - 1)

    })
    test('create new user missing username', async () => {
        const initialUsers = await helper.retrieveAllUsers()

        const newUser = {
            name: 'Gaia',
            password: 'smoke'
        }

        await api
            .post('/api/users/registration')
            .send(newUser)
            .expect(400)
    })
    test('create new user missing password', async () => {
        const initialUsers = await helper.retrieveAllUsers()

        const newUser = {
            username: 'gaia3',
            name: 'Gaia',
        }

        await api
            .post('/api/users/registration')
            .send(newUser)
            .expect(400)
    })
    test('create new username too short', async () => {
        const initialUsers = await helper.retrieveAllUsers()

        const newUser = {
            username: 'ab',
            name: 'Gaia',
            password: 'smoke'
        }

        await api
            .post('/api/users/registration')
            .send(newUser)
            .expect(400)
    })
    test('User login', async () => {

        const user = {
            userName: 'frederickl1',
            password: 'Ping'
        }

        const result = await api
            .post('/api/users/login')
            .send(user)
            .expect(200)


    })
    test('new user non-unique')
})



after( async () => {
    // Close mongoose connection
    await mongoose.connection.close()
})