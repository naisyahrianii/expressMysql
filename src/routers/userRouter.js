const router = require('express').Router()
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar

const uploadDir = path.join(__dirname + '/../uploads' )
//const deleteDir = fs.unlink(__dirname + '/../uploads')

// fs.access(deleteDir, err => {
//     try {
//         if (!err){
//             fs.unlink(deleteDir)
//         } else {
//             res.send(e)
//         }
//     } catch (e) {
//         res.send(e)
//     }
// })

const storagE = multer.diskStorage({
    // Destination
    destination : function(req, file, cb) {
        cb(null, uploadDir)
    },
    // Filename
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    }
})

const upstore = multer ({
    storage: storagE,
    limits: {
        fileSize: 10000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }

        cb(undefined, true)
    }
})

router.post('/upstore', upstore.single('avatar'), (req, res) => { //upload avatar
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}' where username='${req.body.uname}'`
    const data = req.body.uname

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        conn.query(sql2, (err , result) => {
            if (err) return res.send(err)

            res.send({filename: req.file.filename})
        })
    })
})

// Delete avatar
router.get('/users', async (req, res) => {
    const sql = `SELECT * FROM users WHERE 'username' = ?`
    const sql2 = `UPDATE users SET avatar = NULL WHERE 'username' = ?`
    var data = req.body.username

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        fs.unlink(`${uploadDir}/${result[0].avatar}`, (err) => {
            if(err) throw err
        })

        conn.query(sql2, data, (err, result) => {
            if(err) return res.send(err)

            res.send(result)
        })

    })
      
})

//delete avatar
// router.delete('/delete', (req,res) => {
//     var sql = `UPDATE users SET avatar = NULL WHERE username =?`
//     var sql2 = `SELECT * FROM users WHERE username =?`
    
//     var data = req.body.username

//     conn.query(sql2,data, (err, result) => {
//         if (err) return res.send(err)

//         fs.unlink(`${uploadDir}/${result[0].avatar}`, err => {
//             if (err) return res.send (err); 
            
//           })
//           res.send("file has been deleted")
          
//     })
//     conn.query(sql, (err, result) => {
//         if (err) return res.send(err)
    
//     res.send('File deleted!')
//     })
// })

router.get('/show/', (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const data = req.body.username

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send({
            user: result[0],
            photo: `http://localhost:2010/show/${result[0].avatar}`
        })
    })
})

// router.delete('/upstore', async (req, res, next) => {
//     try {
//         const sql = `SELECT * FROM users WHERE username = ?`
//         const sql2 = `DELETE users SET avatar = '${req.file.filename}'`
//         const data = req.body.uname


//     } catch (e) {
//         res.send(e)
//     }
// })

router.post('/users', async (req, res) => { // CREATE USER
    var sql = `INSERT INTO users SET ?;` // Tanda tanya akan digantikan oleh variable data
    var sql2 = `SELECT * FROM users;`
    var data = req.body // Object dari user {username, name, email, password}

    // validasi untuk email
    if(!isEmail(req.body.email)) return res.send("Email is not valid")
    // ubah password yang masuk dalam bentuk hash
    req.body.password = await bcrypt.hash(req.body.password, 8)

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err.sqlMessage) // Error pada post data

        // sendVerify(req.body.username, req.body.name, req.body.email)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})

router.get('/verify', (req, res) => {
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

module.exports = router