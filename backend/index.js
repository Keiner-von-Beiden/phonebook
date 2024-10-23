require('dotenv').config()              // before other modules so that it can be used globally
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))


app.use(express.json())     // taking json-parser in usage
app.use(morgan(':method method to :url, Status :status, Content lenght :res[content-length], Response time :response-time ms'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).send({ warning: 'document not found'})
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    })
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

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(response.status(204).end()) 
})

  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})