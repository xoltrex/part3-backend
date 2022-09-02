
require('dotenv').config()
const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Person = require('./models/people')
app.use(morgan("tiny"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


app.use(cors())
app.use(express.static("build"));


morgan.token("content", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body)
  return null
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

app.get('/api/people', (request, response) => {
  Person.find({}).then((results) => {
    response.json(results.map((person) => person.toJSON()))
  })
})

app.get('/api/people/:id', (request, response, next) => {
  
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch((error) => next(error))
})

app.delete('/api/people/:id', (request, response, next) => {
  const {id} = request.params
    Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/people', (request, response, next) => {
const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: "no name"})
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then((savedPerson) => {
      response.json(savedPerson.toJSON())
    })
    .catch((error) => next(error))
})

app.put('/api/people/:id', (request, response, next) => {
  const {body} = request
  const {id} = request.params

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  var today = new Date();
  Person.find({}).then((people) => {
    response.send(`Phonebook has ${people.length} people <br/>${today}`)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.message.includes('ObjectId')) {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`shits grooving @ ${PORT}`)