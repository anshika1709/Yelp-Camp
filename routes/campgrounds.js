const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.get('/', async(req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { allCampgrounds });
})

router.get('/new', isLoggedIn, async(req, res) => {
    res.render("campgrounds/new");
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id);
    const { id } = req.params;
    if (!campgroundById) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campgroundById });
}))

router.put('/:id', validateCampground, isAuthor, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    req.flash('success', 'Successfully updated a campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);

}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect(`/campgrounds`);
}))

router.get('/:id', catchAsync(async(req, res) => {
    const campgroundById = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campgroundById) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campgroundById });
}))

module.exports = router;