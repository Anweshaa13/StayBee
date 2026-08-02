const express = require("express");
// const router = express.Router();
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/Listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage});

router.route("/")
.get( wrapAsync(ListingController.index))
.post( isLoggedIn, upload.single('listing[image]'), wrapAsync(ListingController.createListing));



// ================= NEW =================
router.get("/new", isLoggedIn, ListingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(ListingController.showListing)
)
.put(isLoggedIn,isOwner, upload.single('listing[image]'), wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(ListingController.deleteListing));

// ================= EDIT =================

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync (ListingController.renderEditForm));

module.exports = router;