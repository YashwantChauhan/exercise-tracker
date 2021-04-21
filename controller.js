
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
    from = Date.UTC(year,month-1,day)
   


  }
  else{
     from = 0
  }

  
  if( to != undefined ){

    const [year,month,day] = to.split('-')
    to = Date.UTC(year,month-1,day)
    


  }
  else{
     to = 170000000000000;
  }

  
  exerciseModel.findById(id).then(result => {

    
      let response = {
      username: result.username,
      _id: result.id,
      count: result.exercises.length,
      log: (result.exercises.filter(exercise=>{
        if( Number(exercise.date) >= from && Number(exercise.date) <= to ){
          return 1;
        }
        return 0;
      })).map(exercise=>{
      console.log(exercise)
      let kyayaar = new Date(exercise.date).toUTCString()
      kyayaar = kyayaar.slice(0,16) 
      const regex = new RegExp('(...)(,)(...)(....)(.*)')
      kyayaar = kyayaar.replace( regex, '$1$4$3$5')
      exercise.date = kyayaar;
      return exercise
      }).slice(0,limit)
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

    const [year,month,day] = date.split('-')
    
    date = Date.UTC(year,month-1,day) 
    console.log('=',date)
    date = date + ((new Date().getTimezoneOffset())*60000);
    console.log(date)

  }


duration = Number(duration)
  const temp = {
    description, duration, date
  }

  const result = await exerciseModel.findById(id)

  if (result != null) {

    result.exercises.push(temp)
    const result_i = await result.save()
    if (result_i != undefined) {

      let kyayaar = new Date(date).toUTCString()
      kyayaar = kyayaar.slice(0,16) 
       const regex = new RegExp('(...)(,)(...)(....)(.*)')
       kyayaar = kyayaar.replace( regex, '$1$4$3$5')
      const temp_i = {
        _id: result_i.id,
        username: result_i.username,
        date : kyayaar,
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