
const Listing = require("../models/Listing");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const maptiler = require("../cloudConfig/maptiler");


// ======================================================
// INDEX - ALL LISTINGS + SEARCH + FILTERS + CATEGORIES
// ======================================================

module.exports.index = async (req, res) => {

    const { category, filter, search } = req.query;

    let allListing;


    // ==========================
    // 🔍 SEARCH
    // ==========================

    if (search && search.trim() !== "") {

        const searchText = search.trim();

        allListing = await Listing.find({
            $or: [
                {
                    location: {
                        $regex: searchText,
                        $options: "i"
                    }
                },
                {
                    country: {
                        $regex: searchText,
                        $options: "i"
                    }
                },
                {
                    title: {
                        $regex: searchText,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: searchText,
                        $options: "i"
                    }
                }
            ]
        });

    }


    // ==========================
    // 🔥 TRENDING
    // ==========================

  else if (filter === "trending") {

    allListing = await Listing.find({
        isTrending: true
    });
}


    // ==========================
    // 💎 LUXURY
    // ₹9,000 and above
    // ==========================

    else if (filter === "luxury") {

        allListing = await Listing.find({
            price: {
                $gte: 9000
            }
        });

    }


    // ==========================
    // 💰 BUDGET
    // ₹5,000 and below
    // ==========================

    else if (filter === "budget") {

        allListing = await Listing.find({
            price: {
                $lte: 5000
            }
        });

    }


    // ==========================
    // ⭐ PREMIUM
    // ₹7,000 - ₹8,999
    // ==========================

    else if (filter === "premium") {

        allListing = await Listing.find({
            price: {
                $gte: 7000,
                $lt: 9000
            }
        });

    }


    // ==========================
    // 🧳 WEEKEND
    // Currently: ₹7,500 and below
    // ==========================

    else if (filter === "weekend") {

        allListing = await Listing.find({
            price: {
                $lte: 7500
            }
        });

    }


    // ==========================
    // 🏔 CATEGORY
    // Heritage, City, Mountain,
    // Beach, Nature, Unique etc.
    // ==========================

    else if (category) {

        allListing = await Listing.find({
            category: category
        });

    }


    // ==========================
    // 🏠 DEFAULT - ALL LISTINGS
    // ==========================

    else {

        allListing = await Listing.find({});

    }


    res.render("listings/index.ejs", {
        allListing
    });
};


// ======================================================
// RENDER NEW LISTING FORM
// ======================================================

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new");

};


// ======================================================
// SHOW ONE LISTING
// ======================================================
module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }


    // =========================================
    // REVIEW SUMMARY
    // =========================================

    const totalReviews = listing.reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {

        const totalRating = listing.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        averageRating = totalRating / totalReviews;
    }


    // =========================================
    // RATING DISTRIBUTION
    // =========================================

    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    listing.reviews.forEach(review => {

        if (review.rating >= 1 && review.rating <= 5) {
            ratingCounts[review.rating]++;
        }

    });


    // =========================================
    // SEND DATA TO SHOW.EJS
    // =========================================

    res.render("listings/show.ejs", {
        listing,
        totalReviews,
        averageRating,
        ratingCounts
    });
};

// ======================================================
// RENDER EDIT LISTING FORM
// ======================================================

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", {
        listing
    });
};


// ======================================================
// CREATE NEW LISTING
// ======================================================

module.exports.createListing = async (req, res) => {

    // ==========================
    // Validate form data
    // ==========================

    const validationResult = listingSchema.validate(req.body);

    if (validationResult.error) {

        throw new ExpressError(
            400,
            validationResult.error.message
        );

    }


    // ==========================
    // Create listing
    // ==========================

    const newListing = new Listing(req.body.listing);


    // ==========================
    // Get coordinates from MapTiler
    // ==========================

    const fullAddress =
        `${newListing.location}, ${newListing.country}`;

    const result = await maptiler.geocoding.forward(
        fullAddress,
        {
            limit: 1
        }
    );


    console.log("Address:", fullAddress);


    if (
        result.features &&
        result.features.length > 0
    ) {

        newListing.geometry = {

            type: "Point",

            coordinates:
                result.features[0].geometry.coordinates

        };

    } else {

        throw new ExpressError(
            400,
            "Location not found."
        );

    }


    // ==========================
    // Cloudinary image
    // ==========================

    if (req.file) {

        const url = req.file.path;
        const filename = req.file.filename;

        newListing.image = {
            url,
            filename
        };

    }


    // ==========================
    // Owner
    // ==========================

    newListing.owner = req.user._id;


    // ==========================
    // Save
    // ==========================

    await newListing.save();


    req.flash(
        "success",
        "New Listing Created!"
    );


    res.redirect("/listings");

};


// 
// ======================================================
// UPDATE LISTING
// ======================================================

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
if (!req.body.listing.thingsToKnow) {
    req.body.listing.thingsToKnow = {};
}

if (!req.body.listing.thingsToKnow.houseRules) {
    req.body.listing.thingsToKnow.houseRules = [];
}

if (!req.body.listing.thingsToKnow.safety) {
    req.body.listing.thingsToKnow.safety = [];
}

if (!req.body.listing.amenities) {
    req.body.listing.amenities = [];
}


    // Validate submitted data
    const validationResult = listingSchema.validate(req.body);

    if (validationResult.error) {
        throw new ExpressError(
            400,
            validationResult.error.message
        );
    }


    // If no amenity checkbox was selected,
    // explicitly save an empty array
    if (!req.body.listing.amenities) {
        req.body.listing.amenities = [];
    }


    // Find existing listing first
    const oldListing = await Listing.findById(id);

    if (!oldListing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }


    // Check whether address actually changed
    const locationChanged =
        oldListing.location !== req.body.listing.location ||
        oldListing.country !== req.body.listing.country;


    // Update listing fields
    const listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        {
            new: true,
            runValidators: true
        }
    );


    // Update image only if a new one was uploaded
    if (req.file) {

        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };

    }


    // Recalculate coordinates only if address changed
    if (locationChanged) {

        const fullAddress =
            `${listing.location}, ${listing.country}`;

        const result = await maptiler.geocoding.forward(
            fullAddress,
            {
                limit: 1
            }
        );

        if (
            result.features &&
            result.features.length > 0
        ) {

            listing.geometry = {
                type: "Point",
                coordinates:
                    result.features[0].geometry.coordinates
            };

        } else {

            req.flash(
                "error",
                "Location could not be found on the map."
            );

            return res.redirect(`/listings/${id}/edit`);
        }
    }


    await listing.save();


    req.flash(
        "success",
        "Listing Updated!"
    );

    res.redirect(`/listings/${id}`);
};

// ======================================================
// DELETE LISTING
// ======================================================

module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;


    await Listing.findByIdAndDelete(id);


    req.flash(
        "success",
        "Listing Deleted!"
    );


    res.redirect("/listings");

};