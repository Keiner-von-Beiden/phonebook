require('dotenv').config()              // before other modules so that it can be used globally
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))

app.use(express.json())     // taking json-parser in usage; should be among the very first middleware loaded (to get request.body available)
app.use(morgan(':method method to :url, Status :status, Content lenght :res[content-length], Response time :response-time ms'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

//app.get('/', (request, response) => {
//  response.send('<h1>Please go to <a href="api/persons">/api/persons</a> </h1>')
//})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).send({ error: 'document not found'})
        }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person
    .countDocuments({})
    .then(count => {
      response.send(`
        <div>
          <p>The phonebook has info for ${count} people</p>
          <p>${new Date()}</p>
        </div>
      `)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body.name, typeof(body.name))
  if (body.name === undefined || body.name === "") {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(result => {
      // console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)      // should be just before the last middleware (no routes or middleware will be called after its response is sent -- except errorHandler)
app.use(errorHandler)         // has to be the last loaded middleware

  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})