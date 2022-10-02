const express = require('express')
require('./db/mongoose')
const userRoutes = require('./routes/user')
const prodectRoutes = require('./routes/prodect')
const cardRoutes = require('./routes/card')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.use(userRoutes)
app.use(prodectRoutes)
app.use(cardRoutes)

app.listen(port)