const { path, GeneralService } = require('../utils/route-helpers')
const { requireAuth } = require('../middleware/jwt-auth')
const express = require('express')
const MealsService = require('./meals-service')
const mealsRouter = express.Router()

const jsonBodyParser = express.json()

//MIDDLEWARE:
const {checkItemExists,sanitizeItem}= require('../middleware/general')

mealsRouter.route('/')
  // .all(requireAuth)
  .get((req, res, next) => {
      const {userId}= req.query
      if (userId) {
        MealsService.getMealsByUser(req.app.get('db'),userId)
        .then(meals=>{
          const fields=[,"alldaycalories","user:full_name",
          "user:age","user:gender","user:height","user:weight"]
          const sanitizedMeal= sanitizeItem(meals,fields)
          res.status(200).json(sanitizedMeal)
        }).catch(next)
      }
      else GeneralService.getAllItems(req.app.get('db'),'meals')
        .then(meals=>{
          const fields=["alldaycalories"]
          const sanitizedMeal= sanitizeItem(meals,fields)
          res.status(200).json(sanitizedMeal)
        }).catch(next)

  })
  .post(jsonBodyParser, (req, res, next) => {
    const {userid, dateofmeal,breakfast_food,breakfast_calories,lunch_food,lunch_calories,dinner_food,dinner_calories,alldaycalories} = req.body
    const newMeal= {userid, dateofmeal,breakfast_food,breakfast_calories,lunch_food,lunch_calories,dinner_food,dinner_calories,alldaycalories}
  /*   
    for (const field of ['userid', 'dateofmeal','alldaycalories'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
  */

    const sanitizedMeal= sanitizeItem(newMeal)
    
    GeneralService.insertItem(req.app.get('db'),'meals',sanitizedMeal)
      .then(meal=>{
        res.status(201)
        .location(path.posix.join(req.originalUrl,`/${meal.id}`))
        .json(meal)
      })
      .catch(next) 
  })
  

mealsRouter.route('/:id')
  .all((req,res,next)=>checkItemExists(req,res,next,'meals'))
  .get((req, res, next) => {
    // res.json(res.item)
    MealsService.getMealById(req.app.get('db'),req.params.id)
      .then((meal)=>res.status(200).json(meal)).catch(next)
  })
  .delete((req,res,next)=>{
      GeneralService.deleteItem(req.app.get('db'),'meals',req.params.id)
        .then(()=>res.status(200).json('Meal has been deleted'))
  })
  .patch(jsonBodyParser,(req,res,next)=>{
      const {alldaycalories,breakfast_calories,breakfast_food,lunch_food,lunch_calories,dinner_food,dinner_calories}= req.body
      const mealToUpdate={alldaycalories,breakfast_calories,breakfast_food,lunch_food,lunch_calories,dinner_food,dinner_calories}
      return GeneralService.updateItem(req.app.get('db'),'meals',req.params.id,mealToUpdate)
        .then(()=>res.status(200).json('Success'))
        .catch(next)

  })

module.exports = mealsRouter