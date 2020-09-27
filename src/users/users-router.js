const {express,path,jsonBodyParser,GeneralService} =require ('../utils/route-helpers')
/*
const express = require('express')
const path = require('path')
const jsonBodyParser = express.json()
*/
const UsersService = require('./users-service')
const usersRouter = express.Router()

//MIDDLEWARE:
const {checkItemExists}= require('../middleware/general')


usersRouter.route('/')
  .get((req,res,next)=>{
    UsersService.getAllUsers(req.app.get('db'))
      .then(users=>res.json(users))
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const {password, user_name, full_name, gender, age,weight,height } = req.body


    for (const field of ['full_name', 'password','user_name','gender','age','weight','height'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check username doesn't start with spaces

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,            
              full_name,
              weight,
              gender,
              age,
              height             
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

usersRouter.route('/:id')
  .all((req,res,next)=>checkItemExists(req,res,next,'caloriecounter_users'))
  .get((req,res,next)=>{
      res.json(res.item)
  })
  .delete((req,res,next)=>{
      GeneralService.deleteItem(req.app.get('db'),'caloriecounter_users',req.params.id)
        .then(()=>res.status(200).json('User has been deleted'))
  })
  .patch(jsonBodyParser,(req,res,next)=>{
    const {full_name,user_name,password,gender,age,height,weight}= req.body
    const userToUpdate= {full_name,user_name,password,gender,age,height,weight}

    if (!password) return GeneralService.updateItem(req.app.get('db'),'caloriecounter_users',req.params.id,userToUpdate)
      .then(()=>res.status(200).json('Success'))
      .catch(next)

    else {
        UsersService.hashPassword(password)
        .then(hashedPassword=>{
            const updatedUser= {...userToUpdate,password: hashedPassword}
            return GeneralService.updateItem(req.app.get('db'),'caloriecounter_users',req.params.id,updatedUser)
            .then(()=>res.status(200).json('Success'))})
        .catch(next)
    } 
  })


  
    
module.exports = usersRouter