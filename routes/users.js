// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
});

router.get("/list", function(req, res, next) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the users

    //execute sqlquery
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("users.ejs", {availableUsers:result})
    });
});


router.post('/registered', function (req, res, next) {
    const saltRounds = 10
    const plainPassword = req.body.password

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        let sqlquery = "INSERT INTO users (first_name, last_name, email, username, password) VALUES (?,?,?,?,?)"
        
        // execute sql query
        let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, req.body.password]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else {
                result ='Hello '+ req.body.first + ' ' + req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email + 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(result)
            }
        });
    });

});

router.get('/signin', function (req, res, next) {
    res.render('signin.ejs')
});

router.post('/signedin', function (req, res, next) {
    const username = req.body.username
    const plainPassword = req.body.password

    // query database to get the hashed password for the given username
    let sqlquery = "SELECT password FROM users WHERE username = ?"
    
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            next(err)
        }

        if (!result[0]) {
            res.send('Username not found')
        }

        let hashedPassword = result[0].password;
        bcrypt.compare(plainPassword, hashedPassword, function(err, result) {
            if (err) {
              next(err)
            }
            else if (result == true) {
              res.send('Welcome ' + req.body.username + '!' + 'You are now signed in!')
            }
            else {
              res.send('Incorrect Password')
            }
        });
    });
});
            
   











// Export the router object so index.js can access it
module.exports = router
