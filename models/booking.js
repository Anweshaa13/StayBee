const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    checkIn: {
        type: Date,
        required: true,
    },

    checkOut: {
        type: Date,
        required: true,
    },

    nights: {
        type: Number,
        required: true,
    },

    totalPrice: {
        type: Number,
        required: true,
    },

   status: {
    type: String,
    enum: [
        "pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed"
    ],
    default: "pending"
},

    createdAt: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
},

razorpayOrderId: {
    type: String
},

razorpayPaymentId: {
    type: String
}
});

module.exports = mongoose.model("Booking", bookingSchema);