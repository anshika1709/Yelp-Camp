const express = require('express');
const app = express();
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas.js');

mongoose.connect('mongodb://localhost:27017/camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

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

app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();

    res.redirect(`/campgrounds/${newCampground._id}`);

}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campgroundById });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground });

    res.redirect(`/campgrounds/${updatedCampground._id}`);

}))

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    res.redirect(`/campgrounds`);
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campgroundById });
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
app.listen(3000, () => {
    console.log("Serving");
});