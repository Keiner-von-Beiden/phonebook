
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://db-admin:${password}@cluster0.orluu.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)  // model's name => collection's name in plural and lowercase

// const note = new Note({                          // model is used to create a new object/document
//   content: 'Second note',
//   important: false,
// })

// note.save().then(result => {
//   console.log('Result of saving', result)
//   mongoose.connection.close()                    // without connection.close(), the program will never finish its execution
// })

Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })