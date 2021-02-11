const express = require('express');
const app = express();
const path = require('path');
const Campground = require('./models/campground');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/campgrounds', async(req, res) => {
    const newCamp = new Campground({
        title: "ABCamp",

    });
    await newCamp.save();
    res.send(newCamp);
})

app.listen(3000, () => {
    console.log("Serving");
});