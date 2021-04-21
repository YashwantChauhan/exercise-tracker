require('dotenv').config()
const mongoose = require('mongoose')


const mySchema = new mongoose.Schema({

    username : {
        type : String,
        required : true,
        unique : true
    },

    exercises : {
        type : [Object]
    }
})
module.exports = new mongoose.model( 'Exercise',mySchema )