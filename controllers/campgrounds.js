const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render("campgrounds/index", { allCampgrounds });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("campgrounds/new");
}


module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newCampground.save();
    console.log(newCampground);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);

}

module.exports.showCampground = async (req, res) => {
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
}

<<<<<<< HEAD
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campgroundById = await Campground.findById(id)
    if (!campgroundById) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgroundById });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCampground.images.push(...imgs);
    await updatedCampground.save();
=======
module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
>>>>>>> 5b66d10 (Add multiple ima0ge upload feature)
    req.flash('success', 'Successfully updated a campground!');
    res.redirect(`/campgrounds/${updatedCampground._id}`);

}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground!');
    res.redirect(`/campgrounds`);
}