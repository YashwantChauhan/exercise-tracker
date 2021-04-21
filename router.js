const express = require('express')
const router = express.Router()
const { getExercises,addExercises } = require('./controller')


router.route('/users/:id/logs').get(getExercises)
router.route('/users/:id/exercises').post(addExercises)


module.exports = router