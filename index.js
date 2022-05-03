const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
const http = require("http").Server(app);
const { mongoose } = require("./lib/mongo");
const userApi = require('./routes/user');
const { errorHandler, logError, wrapError } = require('./utils/middlewares/errorHandlers')
const notFoundHandlers = require('./utils/middlewares/notFoundHandlers');
const PORT = 3000

//middlewares
app.use(cors({ origin: '*' }))
app.use(morgan('dev'))
app.use(express.json()) // for parsing application/json

//Routes
userApi(app)

//Errors middlewares
app.use(notFoundHandlers)
app.use(wrapError)
app.use(errorHandler)
app.use(logError)




http.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})