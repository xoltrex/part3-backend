const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected')
  })
    .catch((err) => {
      console.log(err)
      process.exit(1)
    })

    const personSchema = new mongoose.Schema({
      name: { type: String, required: true, unique: true},
      number: { type: String, required: true},
    }) 

    personSchema.set('toJSON', {
      transform: (document, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
      },
    })
    
    module.exports = mongoose.model('Person', personSchema)