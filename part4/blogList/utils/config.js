require('dotenv').config()


const mongoUrl = process.env.NODE_ENV !== 'production'
    ? process.env.MONGO_DB_URI_TEST
    : process.env.MONGO_DB_URI

const PORT = 3003

module.exports = {mongoUrl, PORT}