const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.qva8h.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.connect(url)

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


const phoneSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Phone = mongoose.model('Phone', phoneSchema)

if(process.argv.length > 3) {
  const phone = new Phone({
    name: process.argv[3],
    number: process.argv[4]
  })
  phone.save().then(result => {
    console.log('phone entry saved!')
  })
}

/*
Phone.find({name: 'bob'}).then(result => {
  console.log('bob found:',result)
})
*/

/*
//having issues with mongoose.connection.close with multiple concurrent async connections closing mongoose seperately
for(let i = 0; i < persons.length; i++) { //intialize phonebook with previous entries
  //mongoose.connect(url)
  Phone.find({name: persons[i].name}).then(result => {
    mongoose.connect(url)
    console.log(result, typeof result, Object.keys(result).length )
    if(Object.keys(result).length ===  0) {
      console.log('empty')
      const phone = new Phone({
        name: persons[i].name,
        number: persons[i].number
      })
      phone.save().then(result => {
        console.log('phone entry saved!')
      })
    }
  })
}
    /*
    if(result) {
      const phone = new Phone({
        name: persons[i].name,
        number: persons[i].number
      })
      phone.save().then(result => {
        console.log('phone entry saved!')
      })
    })
    */
/*
Phone.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})
*//*
Phone 
  .find({})
  .then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
*/