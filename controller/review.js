const Listing = require("../models/Listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = (async (req, res) => {
console.log(req.params);
    let result = reviewSchema.validate(req.body);

    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    let { id } = req.params;

    let listing = await Listing.findById(id);
    console.log("ID =", id);
console.log("Listing =", listing);

    let newReview = new Review(req.body.review);
newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success", "New Review Created!");

    res.redirect(`/listings/${id}`);

});

module.exports.deleteReview=
(async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);

});