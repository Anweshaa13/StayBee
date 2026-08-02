const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        filename: String,
        url: String,
    },

    price: Number,

    location: String,

    country: String,

    category: {
        type: String,
        enum: [
            "Mountain",
            "Beach",
            "Heritage",
            "Nature",
            "City",
            "Unique",
        ],
        required: true,
    },
amenities: {
    type: [String],
    default: []
},

thingsToKnow: {

    checkIn: {
        type: String,
        default: "12:00 PM"
    },

    checkOut: {
        type: String,
        default: "11:00 AM"
    },

    maxGuests: {
        type: Number,
        default: 2
    },

    cancellationPolicy: {
        type: String,
        default: "Free cancellation for 24 hours."
    },

    houseRules: {
        type: [String],
        default: []
    },

    safety: {
        type: [String],
        default: []
    }

},
    isTrending: {
        type: Boolean,
        default: false,
    },

    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
        },
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});



const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;