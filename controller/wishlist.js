const User = require("../models/user");


// SHOW WISHLIST PAGE
module.exports.showWishlist = async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate("wishlist");

    res.render("wishlist/index.ejs", {
        wishlistListings: user.wishlist
    });
};


// ADD / REMOVE FROM WISHLIST
module.exports.toggleWishlist = async (req, res) => {

    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const alreadyWishlisted = user.wishlist.some(
        listingId => listingId.toString() === id
    );

    if (alreadyWishlisted) {

        user.wishlist.pull(id);

        req.flash("success", "Removed from wishlist");

    } else {

        user.wishlist.push(id);

        req.flash("success", "Added to wishlist ❤️");
    }

    await user.save();

    res.redirect("/listings");
};