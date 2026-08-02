const Listing = require("./models/Listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        // Remember where the user wanted to go
        req.session.redirectUrl = req.originalUrl;

        req.flash(
            "error",
            "Please log in to continue."
        );

        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
   module.exports.isHost = async (req, res, next) => {

    if (!req.user) {
        req.flash("error", "You must be logged in.");
        return res.redirect("/login");
    }

    const listing = await Listing.findOne({
        owner: req.user._id
    });

    if (!listing) {
        req.flash("error", "You are not a host.");
        return res.redirect("/listings");
    }

    next();
};