const handleSignin = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(isValid) {
                return db.select('*').from('users')
                    .where('email','=', email)
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
}

module.exports = {
    handleSignin
}