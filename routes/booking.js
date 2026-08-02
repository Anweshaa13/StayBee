const express = require("express");

const router = express.Router();

const bookingController = require("../controller/booking");
const wrapAsync = require("../utils/wrapAsync");

const {
    isLoggedIn,
    isHost
} = require("../middleware");

router.get(
    "/",
    isLoggedIn,
    bookingController.showBookings
);

router.get(
    "/host",
    isLoggedIn,
    isHost,
    bookingController.showHostDashboard
);

// Accept Booking
router.patch(
    "/:id/accept",
    isLoggedIn,
    isHost,
    bookingController.acceptBooking
);

// Reject Booking
router.patch(
    "/:id/reject",
    isLoggedIn,
    isHost,
    bookingController.rejectBooking
);

router.get(
    "/:id/receipt",
    isLoggedIn,
    wrapAsync(bookingController.downloadReceipt)
);

router.post(
    "/:id",
    isLoggedIn,
    bookingController.createBooking
);
router.delete(
    "/:id",
    isLoggedIn,
    bookingController.cancelBooking
);

router.post(
    "/:bookingId/payment/verify",
    isLoggedIn,
    wrapAsync(bookingController.verifyPayment)
);


module.exports = router;