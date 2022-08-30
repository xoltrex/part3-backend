
const express = require('express')
const morgan = require("morgan")
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
app.use(morgan("tiny"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


let people = [
  {"id": 1, "name": "Arto Hellas", "number": "040-123456"},
  {"id": 2, "name": "Ada Lovelace", "number": "39-44-5323523"},
  {"id": 3, "name": "Dan Abramov", "number": "12-43-234345"},
  {"id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122"}
]

app.use(cors())
app.use(express.static("build"));


morgan.token("content", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body)
  return null
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

app.get('/api/people', (request, response) => {
  response.json(people)
})

app.get('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
  const index = people.find(p => p.id === id)
  if (index) {response.json(index)} 
    else {response.status(404).end()}
})

app.delete('/api/people/:id', (request, response) => {
  const id = Number(request.params.id)
    people = people.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/people', (request, response) => {
const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: "no name"})
  }

  const person = {
    id: people.length+1,
    name: body.name,
    phone: body.number
  }
  const x = people.filter((y) =>y.name === person.name)
  if (x.length !== 0) {
    return response.status(400).json({
      error: "name taken"})
  }
  people = people.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  var today = new Date()
  response.send(`Phonebook has ${people.length} people <br/>${today} <br/>`)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT)
console.log(`shits grooving @ ${PORT}`)