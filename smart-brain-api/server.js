const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex') 

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1', //localhost
        user: 'postgres',
        password: 'drummer_93',
        database: 'smartbrain'
    }
});

db.select('*').from('users').then(data => console.log(data))

const app = express();

app.use(bodyParser.json())
app.use(cors())

//Home - Index
app.get('/', (req, res) => {res.send('Success')})
//Sign In
app.post('/signin', signin.handleSignin(db, bcrypt))
//Register
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)}) //Dependency Injection    
//Profile
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})
//Image
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(3000, ()=> {console.log('app is running on port 3000')})


/*
    / -> this is working
    /signin -> POST = success/fail
    /register -> POST = user
    /profile/:userId -> GET = user
    /image -> PUT -> user
*/


// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ],
//     login: [
//         {
//             id: '987',
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// }

// .insert({
//     // If you are using Knex.js version 1.0.0 or higher this 
//     // now returns an array of objects. Therefore, the code goes from:
//     // loginEmail[0] --> this used to return the email
//     // TO
//     // loginEmail[0].email --> this now returns the email
//        email: loginEmail[0].email, // <-- this is the only change!
//        name: name,
//        joined: new Date()
//   })



// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


