const Booking = require("../models/booking");
const Listing = require("../models/Listing");
const razorpay = require("../razorpay");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");



// SHOW ALL BOOKINGS OF LOGGED-IN USER


module.exports.showBookings = async (req, res) => {

    const bookings = await Booking.find({
    user: req.user._id,
    paymentStatus: "paid"
})
        .populate("listing")
        .sort({ createdAt: -1 });

    res.render("bookings/index", { bookings });
};

// ========================================
// VERIFY PAYMENT
// ========================================

module.exports.verifyPayment = async (req, res) => {

    const { bookingId } = req.params;

    const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found"
        });
    }

    if (
        booking.user.toString() !== req.user._id.toString() ||
        booking.razorpayOrderId !== razorpay_order_id
    ) {
        return res.status(403).json({
            success: false,
            message: "Invalid booking or payment order"
        });
    }

    const body =
        razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {

        booking.paymentStatus = "failed";
        await booking.save();

        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });
    }

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;

    await booking.save();

    return res.json({
        success: true,
        redirectUrl: "/bookings"
    });
};


module.exports.downloadReceipt = async (req, res) => {

    const { id } = req.params;

    // ========================================
    // 1. FIND BOOKING
    // ========================================

    const booking = await Booking.findById(id)
        .populate("listing")
        .populate("user");

    if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/bookings");
    }


    // ========================================
    // 2. MAKE SURE BOOKING BELONGS TO USER
    // ========================================

    if (
        booking.user._id.toString() !==
        req.user._id.toString()
    ) {
        req.flash(
            "error",
            "You cannot download this receipt."
        );

        return res.redirect("/bookings");
    }


    // ========================================
    // 3. ONLY PAID BOOKINGS GET RECEIPTS
    // ========================================

    if (booking.paymentStatus !== "paid") {

        req.flash(
            "error",
            "Receipt is available only for paid bookings."
        );

        return res.redirect("/bookings");
    }


    // ========================================
    // 4. PRICE CALCULATION
    // ========================================

    const stayPrice =
        booking.listing.price * booking.nights;

    const tax =
        booking.totalPrice - stayPrice;


    // ========================================
    // 5. CREATE PDF
    // ========================================

    const doc = new PDFDocument({
        size: "A4",
        margin: 50
    });


    // ========================================
    // 6. DOWNLOAD HEADERS
    // ========================================

    const filename =
        `StayBee-Receipt-${booking._id}.pdf`;

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
    );

    doc.pipe(res);


    // ========================================
    // 7. RECEIPT CONTENT
    // ========================================

    doc
        .fontSize(26)
        .text("StayBee", {
            align: "center"
        });

    doc
        .fontSize(12)
        .text("Booking Payment Receipt", {
            align: "center"
        });

    doc.moveDown(2);


    // Payment status

    doc
        .fontSize(16)
        .text("PAYMENT RECEIVED", {
            align: "center"
        });

    doc.moveDown(2);


    // ========================================
    // BOOKING INFORMATION
    // ========================================

    doc
        .fontSize(16)
        .text("Booking Details");

    doc.moveDown();

    doc
        .fontSize(11)
        .text(`Booking ID: ${booking._id}`);

    doc.text(
        `Guest: ${booking.user.username}`
    );

    doc.text(
        `Property: ${booking.listing.title}`
    );

    doc.text(
        `Location: ${booking.listing.location}, ${booking.listing.country}`
    );

    doc.moveDown();


    doc.text(
        `Check-in: ${booking.checkIn.toLocaleDateString("en-IN")}`
    );

    doc.text(
        `Check-out: ${booking.checkOut.toLocaleDateString("en-IN")}`
    );

    doc.text(
        `Number of nights: ${booking.nights}`
    );


    doc.moveDown(2);


    // ========================================
    // PAYMENT INFORMATION
    // ========================================

    doc
        .fontSize(16)
        .text("Payment Details");

    doc.moveDown();

    doc
        .fontSize(11)
        .text(
            `Stay amount: INR ${stayPrice.toLocaleString("en-IN")}`
        );

    doc.text(
        `GST (18%): INR ${tax.toLocaleString("en-IN")}`
    );

    doc.moveDown();

    doc
        .fontSize(14)
        .text(
            `Total Paid: INR ${booking.totalPrice.toLocaleString("en-IN")}`
        );

    doc.moveDown();


    doc
        .fontSize(11)
        .text(
            `Payment Status: PAID`
        );

    doc.text(
        `Razorpay Payment ID: ${booking.razorpayPaymentId}`
    );

    doc.text(
        `Razorpay Order ID: ${booking.razorpayOrderId}`
    );


    doc.moveDown(3);


    // ========================================
    // FOOTER
    // ========================================

    doc
        .fontSize(10)
        .text(
            "Thank you for booking with StayBee!",
            {
                align: "center"
            }
        );

    doc.text(
        "This receipt was generated electronically.",
        {
            align: "center"
        }
    );


    // FINISH PDF
    

    doc.end();
};

// CREATE BOOKING


module.exports.createBooking = async (req, res) => {

    const { id } = req.params;
    const { checkIn, checkOut } = req.body;



    // 1. FIND LISTING
    

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }


   
    // 2. CHECK DATES
    

    if (!checkIn || !checkOut) {

        req.flash(
            "error",
            "Please select check-in and check-out dates."
        );

        return res.redirect(`/listings/${id}`);
    }


    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);


   
    // 3. VALIDATE DATES
    

    if (
        Number.isNaN(checkInDate.getTime()) ||
        Number.isNaN(checkOutDate.getTime())
    ) {
        req.flash("error", "Please select valid dates.");
        return res.redirect(`/listings/${id}`);
    }


    if (checkOutDate <= checkInDate) {

        req.flash(
            "error",
            "Check-out must be after check-in."
        );

        return res.redirect(`/listings/${id}`);
    }


    
    // 4. PREVENT PAST BOOKING
   

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {

        req.flash(
            "error",
            "Check-in date cannot be in the past."
        );

        return res.redirect(`/listings/${id}`);
    }


    
    // 5. PREVENT OWNER BOOKING OWN PROPERTY
    

    if (
        listing.owner &&
        listing.owner.equals(req.user._id)
    ) {

        req.flash(
            "error",
            "You cannot book your own property."
        );

        return res.redirect(`/listings/${id}`);
    }


    
    // 6. CHECK AVAILABILITY
   

   const existingBooking = await Booking.findOne({

    listing: listing._id,

    paymentStatus: "paid",

    status: {
        $in: ["pending", "confirmed"]
    },

    checkIn: {
        $lt: checkOutDate
    },

    checkOut: {
        $gt: checkInDate
    }

});


    if (existingBooking) {

        req.flash(
            "error",
            "These dates are already booked or awaiting confirmation. Please choose different dates."
        );

        return res.redirect(`/listings/${id}`);
    }


   
    // 7. NUMBER OF NIGHTS
    

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    const nights = Math.round(
        (checkOutDate - checkInDate) /
        millisecondsPerDay
    );


    if (nights <= 0) {

        req.flash(
            "error",
            "Invalid booking duration."
        );

        return res.redirect(`/listings/${id}`);
    }


 // 8. CALCULATE PRICE


    const stayPrice =
        listing.price * nights;

    const tax =
        Math.round(stayPrice * 0.18);

    const totalPrice =
        stayPrice + tax;


    
    // 9. CREATE RAZORPAY ORDER
   

    const razorpayOrder =
        await razorpay.orders.create({

            // Razorpay expects paise
            amount: Math.round(totalPrice * 100),

            currency: "INR",

            receipt: `booking_${Date.now()}`
        });


    
    // 10. CREATE PENDING BOOKING
    

    const booking = new Booking({

        listing: listing._id,

        user: req.user._id,

        checkIn: checkInDate,

        checkOut: checkOutDate,

        nights: nights,

        totalPrice: totalPrice,

        status: "pending",

        paymentStatus: "pending",

        razorpayOrderId: razorpayOrder.id

    });


    await booking.save();


    
    // 11. SHOW PAYMENT PAGE
   

    res.render("bookings/payment", {

        booking,

        listing,

        razorpayOrder,

        keyId: process.env.RAZORPAY_KEY_ID

    });

};

// CANCEL BOOKING

module.exports.cancelBooking = async (req, res) => {

    const { id } = req.params;


    // Find booking

    const booking = await Booking.findById(id);


    if (!booking) {

        req.flash(
            "error",
            "Booking not found!"
        );

        return res.redirect("/bookings");
    }


    
    // CHECK BOOKING OWNER
    

    if (!booking.user.equals(req.user._id)) {

        req.flash(
            "error",
            "You are not allowed to cancel this booking!"
        );

        return res.redirect("/bookings");
    }


    
    // DON'T CANCEL ALREADY FINISHED BOOKING
   

    if (
        booking.status === "cancelled" ||
        booking.status === "rejected" ||
        booking.status === "completed"
    ) {

        req.flash(
            "error",
            "This booking cannot be cancelled."
        );

        return res.redirect("/bookings");
    }


  
    // CHANGE STATUS — DON'T DELETE BOOKING
    

    booking.status = "cancelled";

    await booking.save();


    req.flash(
        "success",
        "Booking cancelled successfully!"
    );


    res.redirect("/bookings");
};



// SHOW HOST DASHBOARD

module.exports.showHostDashboard = async (req, res) => {

    
    // 1. FIND ALL PROPERTIES OWNED BY HOST
    

    const hostListings = await Listing.find({
        owner: req.user._id
    });

    const listingIds = hostListings.map(
        listing => listing._id
    );


   
    // 2. FIND BOOKINGS FOR HOST PROPERTIES
   

   const bookings = await Booking.find({

    listing: {
        $in: listingIds
    },

    paymentStatus: "paid"

})
        .populate("listing")
        .populate("user")
        .sort({ createdAt: -1 });


   
    // 3. TOTAL PROPERTIES
   

    const totalProperties = hostListings.length;


   
    // 4. PENDING BOOKINGS
    

    const pendingBookings = bookings.filter(
        booking => booking.status === "pending"
    ).length;


    
    // 5. CONFIRMED BOOKINGS
   

    const confirmedBookings = bookings.filter(
        booking =>
            booking.status === "confirmed" ||
            booking.status === "completed"
    ).length;


    
    // 6. TOTAL REVENUE
   
    // Only confirmed/completed bookings count.

    const totalRevenue = bookings
        .filter(
            booking =>
                booking.status === "confirmed" ||
                booking.status === "completed"
        )
        .reduce(
            (total, booking) =>
                total + booking.totalPrice,
            0
        );


    
    // 7. SEND EVERYTHING TO HOST.EJS
    

    res.render("bookings/host", {
        bookings,
        totalProperties,
        pendingBookings,
        confirmedBookings,
        totalRevenue
    });
};



// ACCEPT BOOKING

module.exports.acceptBooking = async (req, res) => {

    const { id } = req.params;

    // Find booking and its listing
    const booking = await Booking
        .findById(id)
        .populate("listing");

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings/host");
    }

    // Listing must exist
    if (!booking.listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/bookings/host");
    }

    // Only the owner of this listing can accept
    if (
        !booking.listing.owner ||
        !booking.listing.owner.equals(req.user._id)
    ) {
        req.flash(
            "error",
            "You are not allowed to manage this booking!"
        );

        return res.redirect("/bookings/host");
    }

    // Booking must still be pending
    if (booking.status !== "pending") {
        req.flash(
            "error",
            "This booking has already been processed."
        );

        return res.redirect("/bookings/host");
    }

    // Check if another confirmed booking overlaps
    const conflictingBooking = await Booking.findOne({
        listing: booking.listing._id,

        _id: {
            $ne: booking._id
        },

        status: "confirmed",

        checkIn: {
            $lt: booking.checkOut
        },

        checkOut: {
            $gt: booking.checkIn
        }
    });

    if (conflictingBooking) {
        req.flash(
            "error",
            "These dates conflict with another confirmed reservation."
        );

        return res.redirect("/bookings/host");
    }

    // Confirm this booking
    booking.status = "confirmed";

    await booking.save();

    // Reject other pending bookings that overlap these dates
    await Booking.updateMany(
        {
            listing: booking.listing._id,

            _id: {
                $ne: booking._id
            },

            status: "pending",

            checkIn: {
                $lt: booking.checkOut
            },

            checkOut: {
                $gt: booking.checkIn
            }
        },
        {
            $set: {
                status: "rejected"
            }
        }
    );

    req.flash(
        "success",
        "Booking confirmed successfully!"
    );

    return res.redirect("/bookings/host");
};


// REJECT BOOKING


module.exports.rejectBooking = async (req, res) => {

    const { id } = req.params;


   
    // FIND BOOKING
    

    const booking = await Booking
        .findById(id)
        .populate("listing");


    if (!booking) {

        req.flash(
            "error",
            "Booking not found!"
        );

        return res.redirect("/bookings/host");
    }


    
    // CHECK LISTING EXISTS
    

    if (!booking.listing) {

        req.flash(
            "error",
            "The listing for this booking no longer exists."
        );

        return res.redirect("/bookings/host");
    }


    
    // CHECK CURRENT USER OWNS THIS PROPERTY
   

    if (
        !booking.listing.owner ||
        !booking.listing.owner.equals(req.user._id)
    ) {

        req.flash(
            "error",
            "You are not allowed to manage this booking!"
        );

        return res.redirect("/bookings/host");
    }


    
    // ONLY PENDING BOOKINGS CAN BE REJECTED
    

    if (booking.status !== "pending") {

        req.flash(
            "error",
            "This booking has already been processed."
        );

        return res.redirect("/bookings/host");
    }


    
    // REJECT
    

    booking.status = "rejected";

    await booking.save();


    req.flash(
        "success",
        "Booking rejected."
    );


    res.redirect("/bookings/host");
};