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
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body, typeof(body), body.content)
  if (body.name === undefined || body.number === undefined) {
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

  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})