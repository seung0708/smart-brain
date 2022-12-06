/*
    / -> this is working
    /signin -> POST = success/fail
    /register -> POST = user
    /profile/:userId -> GET = user
    /image -> PUT -> user
*/
const express = require('express')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex') 

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

//Home - Index
app.get('/', (req, res) => {
    //res.send(database.users)
    res.send('Success')
})


//Sign In
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid) {
                return db.select('*').from('users')
                    .where('email','=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to retrieve user'))
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json("Email or password doesn't math"))
    // //res.send('signing in') => signing in
    // if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    //     res.json(database.users[0]);
    // } else {
    //     res.status(400).json('error logging in');
    // }
    // //res.json('signing in') //"signing in"
})


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


//Register
app.post('/register', (req, res) => {
    const {email, name, password} = req.body; 
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*') //knex method; return all the columns
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {res.json(user[0])})
                    .catch(err => res.status(400).json('Email or password already exists'))
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
})     

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    // let found = false;
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('User not found')
        }    
    })
    // if(!found) {
    //     res.status(400).json('Not found')
    // }
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id','=', id) 
        .increment('entries',1)
        .returning('entries')
        .then(entries => {
            console.log(entries[0].entries)
        })
        .catch(err => res.status(400).json('Unable to get entries'))
    // let found = false;
    // if(!found) {
    //     res.status(400).json('Not found')
    // }
})


app.listen(3000, ()=> {
    console.log('app is running on port 3000')
})


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


