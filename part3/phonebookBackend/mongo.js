const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

// Fetches the password from the terminal command when you run 'node mongo.js yourPassword'

const [,,password, name, number ] = process.argv

// const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

const url = `mongodb+srv://hellofredlewis:${password}@cluster0.zlwz79c.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (!name && !number) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
        })
} else {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}