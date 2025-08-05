const mongoose = require('mongoose')
const url = process.env.MONGO_DB_URL
console.log("Mongoose URL:", url)
mongoose.set('strictQuery',false)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })
function validator (val) {
  const regex = /[0-9]{2,3}-[0-9]*/
  return regex.test(val)
}
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, 'Name needs to be at least 3 characters long'],
    },
    number: {
        type: String,
        reqiured: true,
        minLength: [8, 'Number needs to be at least 8 characters long'],
        validate: [validator, 'Number does not match expected format']
    }
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
const Person = mongoose.model('Person', personSchema)

module.exports = Person