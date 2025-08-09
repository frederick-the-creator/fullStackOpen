const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./helper')
const User = require('../models/user')
const mongoose = require('mongoose')
const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
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
            .post('/api/users')
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
            .post('/api/users')
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
            .post('/api/users')
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
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })
    test('new user without username')
    test('new user non-unique')
})



after( async () => {
    // Close mongoose connection
    await mongoose.connection.close()
})