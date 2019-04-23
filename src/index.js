const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const {sendVerify} = require('./emails/sendGrid')

const app = express()
const port = 2010

app.use(express.json())

const conn = mysql.createConnection({
    user: 'devuser',
    password: 'Mysql123',
    host: 'localhost',
    database: 'jc8expressmysql',
    port: '3306'
})

app.post('/users', async (req, res) => { // CREATE USER
    var sql = `INSERT INTO users SET ?;` // Tanda tanya akan digantikan oleh variable data
    var sql2 = `SELECT * FROM users;`
    var data = req.body // Object dari user {username, name, email, password}

    // validasi untuk email
    if(!isEmail(req.body.email)) return res.send("Email is not valid")
    // ubah password yang masuk dalam bentuk hash
    req.body.password = await bcrypt.hash(req.body.password, 8)

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage) // Error pada post data

        sendVerify(req.body.username, req.body.name, req.body.email)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})

app.get('/verify', (req, res) => {
    const username = req.query.username
    const sql = `UPDATE users SET verified = true WHERE username = '${username}'`
    const sql2 = `SELECT * FROM users WHERE username = '${username}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send('<h1>Verifikasi berhasil</h1>')
        })
    })
})

app.listen(port, () => {
    console.log("Running at ", port);
    
})