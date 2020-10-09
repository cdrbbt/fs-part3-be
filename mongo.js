const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Provide password to see entries or password and name with number to add an entry')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.zmerw.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find().then((people) => {
    console.log('Phonebook:')
    console.log(people)
    people.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
    process.exit(1)
  })
}

const name = process.argv[3]
const number = process.argv[4]

newPerson = new Person({
  name,
  number
})

newPerson.save().then(result => {
  console.log(`added ${result.name} with number ${result.number}`)
  mongoose.connection.close()
})
