const Phone = require('./models/phone')


Phone.find({}).then(result => {
  console.log(result[7]._id)
  if(Object.keys(result).length === 0) {
    console.log('result is empty')
  }
  Phone.findByIdAndUpdate(result[7]._id,{number: '112'})
  })
})


