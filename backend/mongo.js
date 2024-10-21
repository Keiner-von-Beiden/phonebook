
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Give the password as argument")
    console.log("Example: node mongo.js <password> \"John Doe\" 123-1234567")
    process.exit(1)
}

if (process.argv.length === 4) {
  console.log("The command should contain: your password, person's name, and their phone number")
  console.log("Example: node mongo.js <password> \"John Doe\" 123-1234567")
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://db-admin:${password}@cluster0.orluu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)  

const person = new Person({                  
  name: process.argv[3],
  number: process.argv[4],
})

process.argv.length === 3
    ? Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
          console.log('-', person.name, person.number)
        })
        mongoose.connection.close()
    })
    : person.save().then(result => {
        console.log(`Added ${process.argv[3]}'s number ${process.argv[4]} to the phonebook`)
        mongoose.connection.close()  
    })

