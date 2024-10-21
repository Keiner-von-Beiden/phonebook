// run this with 'npm start <MongoDB-password>'

const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const password = process.argv[2]


const url =
  `mongodb+srv://db-admin:${password}@cluster0.orluu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema) 



app.use(express.json())     // taking json-parser in usage
app.use(morgan(':method method to :url, Status :status, Content lenght :res[content-length], Response time :response-time ms'))

app.get('/', (request, response) => {
    response.send('<h1>Please go to <a href="api/persons">/api/persons</a> </h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
    response.send(`
      <div>
        <p>The phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(item => item.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(item => item.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    let person = request.body
    console.log({person})
    const existingIds = persons.map(item => item.id)
    const existingNames = persons.map(item => item.name)
    // console.log({existingIds})
    let newId 

    if ( !(person.name && person.number) ) {
        return response.status(400).json({
            error: "This request doesn't contain name or number"
        })
    }

    if ( existingNames.includes(person.name) ) {
        return response.status(400).json({
            error: 'This name is already in the phonebook'
        })
    }
    
    do {
        newId = Math.floor(Math.random() * 1000)
        console.log({newId})
    } while (existingIds.includes(newId))
    
    person = {...person, "id": newId}
    persons = persons.concat(person)
    response.json(person)
})
  
const PORT = process.env.port || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})