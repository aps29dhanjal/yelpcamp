const Campground = require('../models/campground')
const Review = require('../models/review');
module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success', "Created new review")
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "successfully deleted")
    res.redirect(`/campgrounds/${id}`);
}