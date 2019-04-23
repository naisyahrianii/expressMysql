const express = require('express')
//const mysql = require('mysql')
const userRouter = require('./routers/userRouter')

const app = express()
const port = 2010

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log("Running at ", port);
    
})