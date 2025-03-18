import 'dotenv/config'
import express from 'express'
import nunjucks from 'nunjucks'
import logger from 'morgan'
import bodyParser from 'body-parser'

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

app.get("/login", (req, res) => {
  res.render('login.njk', {
    title: 'LoginPage'
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})