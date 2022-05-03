const mongoose = require('mongoose')
const MONGO_URI = 'mongodb+srv://pacificode:pacificode2020@cluster0.jxebb.mongodb.net/eclass?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(db => console.log("Connect to DB"))
    .catch(err => console.log(err))

module.exports = mongoose
