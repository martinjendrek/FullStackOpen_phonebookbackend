const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length === 4 || process.argv.length > 5) {
    console.log('Proper format: node mongo.js <password> <name> <number>. Expected either 1 or 3 args ')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://martinjendrek1:${password}@cluster0.k57jcos.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.map(person => {
        console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3], 
        number: process.argv[4]
      })
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
}




