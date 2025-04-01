import 'dotenv/config'
import express from 'express'
import nunjucks from 'nunjucks'
import logger from 'morgan'
import bodyParser from 'body-parser'
import pool from './db.js'
import bcrypt from 'bcrypt'
import session from 'express-session'

const app = express()
const port = 3000

nunjucks.configure("views", {
  autoescape: true,
  express: app,
})

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: { sameSite: true }
}))

app.use(logger("dev"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  res.render('index.njk',
    { title: 'LoginTest', views: req.session.views }
  )
})

app.get('/signup', async (req, res) => {
  res.render('signup.njk', {
    title: 'SignUpPage'
  })
})

app.get('/login', async (req, res) => {
  
  res.render('login.njk', {
    title: 'LoginPage'
  })
})

app.get('/secret', async (req, res) => {
  res.render('secretsite.njk', {

  })
})

app.post('/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const passwordhash = await pool.promise().query('SELECT users.password FROM users WHERE users.name = ?', [username]) 
  
  bcrypt.compare(password, passwordhash, function(err, result) { // FIXA DET HÄR
    if (result == true) {res.redirect("/secret")}
    else if (result == false) {res.send('Something Went Wrong')}
    else (res.send('404'))
  })
})

app.post('/signup', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (await pool.promise().query('SELECT * FROM users WHERE users.name = ?' [username]) != null) {res.send('Something Went Wrong')}
  else if (await pool.promise().query('SELECT users.* WHERE users.name = ?' [username]) == null) {
    bcrypt.hash(password, 10, async function (err, hash) {
    await pool.promise().query('INSERT INTO users (name, password) VALUES (?, ?)', [username, hash])
    })
  }
})

/*app.post('/signup', async (req, res) => {
  bcrypt.hash(myPlaintextPassword, 10, async function (err, hash) {
    await pool.promise().query('UPDATE users SET users.password = ?', [hash])
  })
})*/



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})