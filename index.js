require('dotenv').config()

const express = require('express')
const app = express()
const routes = require('./routes/routes')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')

const mongoURI = `mongodb://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@localhost:27017/`;

// MongoDB options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


mongoose.connect(mongoURI, options)
    .then(() => {
        console.log('Connected to MongoDB Success!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });



app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/', routes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})