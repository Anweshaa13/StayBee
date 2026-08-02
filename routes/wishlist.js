const express = require("express");
const router = express.Router();

const wishlistController = require("../controller/wishlist");
const { isLoggedIn } = require("../middleware");

router.get(
    "/",
    isLoggedIn,
    wishlistController.showWishlist
);

router.post(
    "/:id",
    isLoggedIn,
    wishlistController.toggleWishlist
);



module.exports = router;