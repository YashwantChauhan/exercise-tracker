
const exerciseModel = require('./model')
console.log(exerciseModel)


async function add(req,res){

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
      username : user_saved.username,
      '_id': user_saved.id
    })
  }

  res.end()


}


async function show(req,res){

  exerciseModel.find().select(['username','id']).then(result=>{
    res.status(200).json(result)
  }).catch(err=>{
    res.status(400).json(err)
  })
    
}

module.exports = { add, show }