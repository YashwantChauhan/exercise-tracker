
const exerciseModel = require('./model')
console.log(exerciseModel)


async function add(req, res) {

  const { username } = req.body
  const user = new exerciseModel({
    username: username,
    exercises: []
  })
  const user_saved = await user.save().catch(error => {
    res.status(400).json({
      'status': 'failure',
      'error': 'username taken'
    })
  })

  if (user_saved != undefined) {
    res.json({
      username: user_saved.username,
      '_id': user_saved.id
    })
  }

  res.end()


}


async function show(req, res) {

  exerciseModel.find().select(['username', 'id']).then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(400).json(err)
  })

}


async function getExercises(req, res) {

  id = req.params.id
  let {from,to,limit} = req.query;

  if( limit == undefined ) limit = Infinity

  if( from != undefined ){

    const [year,month,day] = from.split('-')
    from = Date.UTC(year,month,day)
   


  }
  else{
     from = 0
  }

  
  if( to != undefined ){

    const [year,month,day] = to.split('-')
    to = Date.UTC(year,month,day)
    


  }
  else{
     to = 1700000000000;
  }

  
  exerciseModel.findById(id).then(result => {

    
      let response = {
      username: result.username,
      id: result.id,
      count: result.exercises.length,
      logs: (result.exercises.filter(exercise=>{
        if( Number(exercise.date) >= from && Number(exercise.date) <= to ){
          return 1;
        }
        return 0;
      })).slice(0,limit)
    }

    res.status(200).json(response)

  }).catch(err => {
    res.status(400).json({
      message: 'not found'
    })
  })
}

async function addExercises(req, res) {

  id = req.params.id
  let { duration, description, date } = req.body

  if (date == undefined) {
    
    date = new Date().getTime()

  }
  else{

    const [year,month,day] = date.split('/')
    date = Date.UTC(year,month,day)

  }



  const temp = {
    description, duration, date
  }

  const result = await exerciseModel.findById(id)

  console.log(date);
  if (result != null) {

    result.exercises.push(temp)
    const result_i = await result.save()

    console.log(result_i);
    if (result_i != undefined) {

      const temp_i = {
        _id: result_i.id,
        username: result_i.username,
        date,
        duration,
        description

      }

      res.status(200).json(temp_i)
    }
   


  }
  else{
    
    res.status(400).json({
      'ERROR' : 'USER NOT FOUND'
    })
    
  }
}

module.exports = { add, show, getExercises, addExercises }