const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const uri = process.env.URI
const Router = require('./router')

//-----------------------------------------------------------------------------------------------------------------------
const mongoose = require('mongoose')
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
  console.log('Success')
}).catch(err => {
  console.log(err)
})


//--------------------------------------

const exerciseModel = require('./model')
console.log(exerciseModel)


//-----------------------------------------------------------------------------------------------------------------------

const {add,show } = require('./controller')

//---------------------------------------

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({  extended: "false" }))

//------------------------------------------------------------------------------------------------------------------------

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', add )
app.get('/api/users', show )


app.use('/api' , Router )


const listener = app.listen(5000 || process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
