const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', async(req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { allCampgrounds });
})

router.get('/new', async(req, res) => {
    res.render("campgrounds/new");
})

router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    if (!req.body.campground)
        throw new ExpressError('Invalid Campground Data', 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id);
    if (!campgroundById) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campgroundById });
}))

router.put('/:id', validateCampground, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    req.flash('success', 'Successfully updated a campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);

}))

router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect(`/campgrounds`);
}))

router.get('/:id', catchAsync(async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id).populate('reviews');
    if (!campgroundById) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campgroundById });
}))

module.exports = router;