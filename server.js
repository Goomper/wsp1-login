import 'dotenv/config'
import express from 'express'
import nunjucks from 'nunjucks'
import logger from 'morgan'
import bodyParser from 'body-parser'
import pool from './db.js'
import bcrypt from 'bcrypt'

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(logger("dev"))
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render('index.njk', {
    title: 'LoginTest',
  })
})

app.get("/signup", async (req, res) => {
  res.render('signup.njk', {
    title: 'SignUpPage'
  })
})

app.get("/login", async (req, res) => {
  const username = req.params.username
  const [users] = await pool.promise().query('SELECT * FROM users WHERE users.username = ?', [username])
  const myPlaintextPassword = req.params.password
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
    })
  })

  res.render('login.njk', {
    title: 'LoginPage'
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})