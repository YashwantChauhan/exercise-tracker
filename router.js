const express = require('express')
const router = express.Router()
const { getExercises,addExercises } = require('./controller')


router.route('/:id/logs').get(getExercises)
router.route('/:id/exercises').post(addExercises)


module.exports = router