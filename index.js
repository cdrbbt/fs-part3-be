require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

const generateId = () => {
  return Math.floor(Math.random()*10000000)
}

app.get('/info', (req, res) => {
  res.send(`<p>There are ${persons.length} people registered in the phonebook</p><p>As of ${new Date().toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
  Person.find().then(persons =>{
    res.json(persons)
  }).catch( error => {
    next({error, msg:'failed to fetch persons list'})
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({error: 'missing data'})
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(newPerson => {
    res.json(newPerson)
  }).catch(error => {
    next({error, msg:'failed to save to db'})
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.put('/api/persons/:id', (req, res, next) => {
  return
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  }).catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error)
  res.status(500).send({error:error.msg})
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
  console.log(`Server on port ${PORT}`)
})