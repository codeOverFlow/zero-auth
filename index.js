const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
const app = express()
const path = require('path')
const port = 8080
const crypto = require("crypto");
var rng = '';

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './views')
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    let db = new sqlite3.Database(path.join(__dirname + '/db.sqlite'), (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    db.run('CREATE TABLE users(username text, public text)', [], function(err) {
        console.log('table already exists.');
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });

    res.sendFile(path.join(__dirname+'/index.html'))
})

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname+'/create.html'))
})

app.post('/create', (req, res) => {
    let db = new sqlite3.Database(path.join(__dirname + '/db.sqlite'), (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    db.run(`INSERT INTO users(username, public) VALUES(?, ?)`, [req.body.username, req.body.public], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });

    res.sendFile(path.join(__dirname+'/create_account.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname+'/login.html'))
})

function log_form(res, success, encrypted) {
    if (success) {
        res.render('login_form', {encoded: encrypted})
    }
    else {
        res.sendFile(path.join(__dirname+'/login_failed.html'))
    }
}

app.post('/login_form', (req, res) => {
    let success = false;
    let db = new sqlite3.Database(path.join(__dirname + '/db.sqlite'), (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });

    db.get("SELECT * FROM users WHERE username = ?", [req.body.username], (err, row)=>{
        if (err) {
            console.log('cannot find user', req.body.username);
            log_form(res, false, undefined);
        }
        else {
            console.log('success');
            rng = crypto.randomBytes(20).toString('hex');
            const encryptedData = crypto.publicEncrypt(
                {
                    key: Buffer.from(row.public),
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                },
                // We convert the data string to a buffer using `Buffer.from`
                Buffer.from(rng)
            );
            log_form(res, true, encryptedData.toString('base64'));
        }
    });

    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
})

app.post('/final_login', (req, res) => {
    if (req.body.decoded == rng) {
        res.sendFile(path.join(__dirname+'/login_ok.html'))
    }
    else {
        res.sendFile(path.join(__dirname+'/login_failed.html'))
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

