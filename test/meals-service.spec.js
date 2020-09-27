const knex = require('knex')
const app = require('../src/app')
const bcrypt = require('bcryptjs')

describe(`Meals service object`, function () {
  let db
  let testMeals = [
    {
      id: 1,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_modified: new Date('2030-01-22T16:28:32.615Z'),
      alldaycalories: '2000',
    },
    {
      id: 1,
      date_created: new Date('2229-01-22T16:28:32.615Z'),
      date_modified: new Date('2230-01-22T16:28:32.615Z'),
      alldaycalories: '2400',
    },
    {
      id: 1,
      date_created: new Date('1929-01-22T16:28:32.615Z'),
      date_modified: new Date('1930-01-22T16:28:32.615Z'),
      alldaycalories: '1600',
    }
  ]
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('meals').truncate())

  afterEach(() => db('meals').truncate())

  after(() => db.destroy())

  context(`Given 'meals' has data`, () => {
    beforeEach(() => {
      return db
        .into('meals')
        .insert(testMeals)
    })
  })

  it(`resolves all meals from 'meals' table`, () => {
    return MealsService.getAllMeals(db)
      .then(actual => {
        expect(actual).to.eql(testMeals)
      })
  })

  it(`getById() resolves a meal by id from the 'meals' table`, () => {
    const thirdId = 3
    const thirdTestMeal = testMeals[thirdId - 1]
    return MealsService.getById(db, thirdId)
      .then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          date_created: thirdTestMeal.date_created,
          date_modified: thirdTestMeal.date_modified,
          alldaycalories: thirdTestMeal.alldaycalories
        })
      })
  })
})

