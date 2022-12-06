const handleRegister = (req, res, db, bcrypt) => {
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
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
}

module.exports = {
    handleRegister
}