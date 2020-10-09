const app= require('../src/app')
const bcrypt= require('bcryptjs')

const makeTables= {
    users(){
        return [
            {   "id": 1,
                "full_name": "greg",
                "user_name": "greg123",
                "password": "aaAA11!!",
                "gender": "male", "age": "25",
                "weight": "170","height": "5 11",
                "isAdmin": false,"profile_pic": null,
                "date_modified": null,
                "date_created": "2020-09-16T02:43:41.247Z"
            },
            {   "id": 2,
                "full_name": "kiuds",
                "user_name": "kidus123",
                "password": "aaAA11!!",
                "gender": "male", "age": "25",
                "weight": "170","height": "5 11",
                "isAdmin": false,"profile_pic": null,
                "date_modified": null,
                "date_created": "2020-09-16T02:43:41.247Z"
            },
            {   "id": 3,
                "full_name": "typnek",
                "user_name": "ty123",
                "password": "aaAA11!!",
                "gender": "male","weight": "170",
                "height": "5 11","age": "25",
                "isAdmin": false,"profile_pic": null,
                "date_modified": null,
                "date_created": "2020-09-16T02:43:41.247Z"
            },
        ]
    }, 
    meals(){
        return [
            {
                "id": 1,
                "userId": 1,
                "alldaycalories": "645",
                "date_created": "2020-09-16T02:43:41.247Z",
                "date_modified": null,
            },
            {
                "id": 2,"userId": 2,
                "alldaycalories": "645",
                "date_created": "2020-09-16T02:43:41.247Z",
                "date_modified": null,
            },
            {
                "id": 3,"userId": 3,
                "alldaycalories": "645",
                "date_created": "2020-09-16T02:43:41.247Z",
                "date_modified": null,
            },
        ]
    } 
}
const prepareTest={
    getData(){
        const testUsers= makeTables.users()
        const testMeals= makeTables.meals()
        return {testUsers,testMeals}
    },
    getTestData(name){
        const {testUsers,testMeals}=this.getData()
        const {newUser,newMeal}= tools.makeNewItem()
        const {user,meal}= tools.makeUpdatedItem()
        
        const array=[
            {db:"users",all: testUsers,newItem:newUser, updatedFields:user},
            {db:"meals",all: testMeals,newItem:newMeal, updatedFields:meal},
        ]
        const obj= array.find(obj=>obj.db===name) || {all:[],newItem:{},updatedFields:[]}
        const AllItems= obj.all
        const NewItem= obj.newItem
        const UpdatedFields= obj.updatedFields

        return {AllItems,NewItem,UpdatedFields}
    },
    seedTables(db,data){
        const {testUsers}= data
        return this.seedTable(db,'caloriecounter_users',testUsers)
            //.then(()=>testReviews.length && this.seedTable(db,'reviews',testReviews))
    },
    seedTable(db,dbName,items){
        return db.into(dbName).insert(items)
            .then(()=>db.raw(
                `SELECT setval('${dbName}_id_seq',?)`,
                [items[items.length-1].id]
            ))
    },
    seedUsers(db,users){
        return db.into('caloriecounter_users').insert(users)
            .then(()=>db.raw(
                `SELECT setval('caloriecounter_users_id_seq',?)`,
                [users[users.length-1].id], //update the auto sequence to stay in sync
            ))
    },
    cleanTables(db){
        return db.raw(
            `TRUNCATE
                meals,
                caloriecounter_users
            RESTART idENTITY CASCADE`
        )
    }
}

const tools={
    makeFetchRequests(endpoint,valid,invalid){
        const token= `Basic ${process.env.API_TOKEN}`
        const get= supertest(app).get(`/api/${endpoint}`).set('Authorization',token)
        const post= supertest(app).post(`/api/${endpoint}`).set('Authorization',token)
        const invalidFetch=[
            {GET: supertest(app).get(`/api/${endpoint}/${invalid}`).set('Authorization',token)},
            {DELETE: supertest(app).delete(`/api/${endpoint}/${invalid}`).set('Authorization',token)},
            {PATCH: supertest(app).patch(`/api/${endpoint}/${invalid}`).set('Authorization',token)}
        ]
        const validFetch={
            GET: supertest(app).get(`/api/${endpoint}/${valid}`).set('Authorization',token),
            DELETE: supertest(app).delete(`/api/${endpoint}/${valid}`).set('Authorization',token),
            PATCH: supertest(app).patch(`/api/${endpoint}/${valid}`).set('Authorization',token)
        }
        
        const getItemById= endpoint==='meals'
                        ? this.makeExpectedItem().expectedMeal
                        : makeTables.users().find(obj=>obj.id==valid)

        return {get,post,invalidFetch,validFetch,getItemById}
    },
    makeAuthHeader(user){
        const token = Buffer.from(`${user.user_name}:${user.password}`).toString(`base64`)
        return `Bearer ${token}`
    },
    makeNewItem(){
        const newUser= {
            "full_name": "Alex", 
            "user_name": "aw1990", "password": "11AAaa!!",
            "age": 18, "gender": "Male", "weight": "130", "height":"70"
        }
        const newMeal={
            "userid": 1, 
            "dateofmeal": "2020-09-23",
            "breakfast_food": "milk",
            "breakfast_calories": 200,
            "lunch_food": "pasta",
            "lunch_calories": 300,
            "dinner_food": "chicken noodle soup",
            "dinner_calories": 300,
            "alldaycalories": 800
        }
        return {newUser,newMeal}
    },
    makeUpdatedItem(){
        const user=[
            {"With_password":{"password": "newP@ssword123"}},
            //{"Without_password":{"username": "newUserName"}}
        ]
        const meal=[
            {"Update_meal":{
                "breakfast_calories": 200,
                "lunch_calories": 300,
                "dinner_calories": 300,
                "alldaycalories": 800
            }}
        ]
        return {user,meal}
    },
    makeExpectedItem(){
        
        const expectedMeal={
            "id": 2,
            "alldaycalories": "900",
            "date_created": "2020-09-19T05:50:17.372Z",
            "user:id": 2,
            "user:full_name": "kidus",
            "user:age": "25",
            "user:gender": "male",
            "user:height": "5 11",
            "user:weight": "170"
        }
        return {expectedMeal}
    },
    hashPassword(password){
        return bcrypt.hash(password,12)
    },
}


module.exports= {makeTables,prepareTest,tools}