require('dotenv').config()
const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
const Phone = require('./models/phone')

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
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

app.get('/', (request, response,next) => {
  
  response.send('<h1>Hello World!!</h1>')
  .catch(error => next(error))
  
})

app.get('/api/persons', (request, response,next) => {
  Phone.find({}).then(result => {
    response.json(result)
  })
  .catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  const info = {
    length: persons.length,
    date: new Date()
  }
  response.send(`<h1>Info for ${info.length} people </h1>
  <div> ${info.date} </div>`)
  
})

app.get('/api/persons/:id', (request,response,next) => {

  Phone.findById(request.params.id).then(result => {
    response.json(result)
  })
  .catch(error => next(error))

})

app.delete('/api/persons/:id', (request,response,next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if(body.name === undefined) {
    return response.status(400).json({error:'content missing'})
  }
  Phone.find({name: body.name }).then(result => {
    console.log(result)
    console.log(body.name)
    console.log('keys: ' + Object.keys(result))
    if(Object.keys(result) > 0) {
      console.log('update!')
      console.log(typeof body.number, body.number,result[0]._id)
      Phone.findByIdAndUpdate(result[0]._id, {number: body.number}, {new:true})
        .then(updatedPhoneEntry => {
          response.json(updatedPhoneEntry)
        })
        .catch(error => next(error))
    }
    else {
      console.log('create new entry!')
      const phonebookEntry = new Phone({
        name: body.name,
        number: body.number,
      })
      phonebookEntry.save().then(result => {
        response.json(result)
      })
      .catch(error => next(error))
    } 
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
