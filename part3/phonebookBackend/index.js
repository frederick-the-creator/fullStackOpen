require('dotenv').config()
const express = require('express')
const Person = require('./models/persons')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('reqBody', function (req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))


app.get('/info', (request, response) => {
    const date = new Date()
    Person
    .find({})
    .then(result => {
    response.send(
        `<div>Phonebook has info for ${result.length} people</div>
         <div>${date.toString()}<div/>
        `
    )})
})

app.get('/api/persons', (request, response, next) => {

    Person
    .find({})
    .then(result => {
        response.json(result)
    })
    .catch(error => {
        next(error)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person
    .findById(id)
    .then(result => {
        response.status(200).json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person
    .findByIdAndDelete(id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
    console.log('Create new person route triggered')
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "Either name or number is missing"
        })
    }

    const person = new Person ({
        name:body.name,
        number:body.number,
    })

    person
    .save()
    .then(result => {
        console.log('Person added!')
        response.status(200).json(result)
    })
    .catch(error => {
        next(error)
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const {name, number} = request.body
    
    Person
    .findById(id)
    .then(person => {
        if (!person) {
            console.log('Person not found')
            response.status(404).end()
        } else {
            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        }
    })
    .catch(error => next(error))
})

// Nested promises
// Using return within promise callback

const errorHandler = (error, request, response, next) => {
    console.log('error:',error.message)
    // next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server is up an running, Baby!")
})