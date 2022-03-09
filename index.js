const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
morgan.token('info', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))


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

app.get('/', (request, response) => {
  
  response.send('<h1>Hello World!!</h1>')
  
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const info = {
    length: persons.length,
    date: new Date()
  }
  response.send(`<h1>Info for ${info.length} people </h1>
  <div> ${info.date} </div>`)
  
})

app.get('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if(person) {
    response.json(person)
  }else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const checkDuplicateName = persons.filter(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  console.log(checkDuplicateName)
  if(checkDuplicateName.length === 1){
    return response.status(400).json({ 
      error: 'duplicate name',
      name: body.name
    })
  }

  const id = Math.floor(Math.random() * 100000)
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }
  persons = persons.concat(person)
  response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
