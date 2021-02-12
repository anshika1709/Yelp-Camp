const express = require('express');
const app = express();
const path = require('path');
const Campground = require('./models/campground');
const mongoose = require('mongoose');
const campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/campgrounds', async(req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { allCampgrounds });
})

app.get('/campgrounds/new', async(req, res) => {
    res.render("campgrounds/new");
})

app.post('/campgrounds', async(req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();

    res.redirect(`campgrounds/${newCampground._id}`);


})

app.get('/campgrounds/:id', async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campgroundById });
})

app.listen(3000, () => {
    console.log("Serving");
});