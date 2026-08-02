const Joi = require("joi");

module.exports.listingSchema = Joi.object({

    listing: Joi.object({

        title: Joi.string().required(),

        description: Joi.string().required(),

        location: Joi.string().required(),

        country: Joi.string().required(),

        price: Joi.number()
            .required()
            .min(0),

        image: Joi.string()
            .allow("", null),

        category: Joi.string()
            .valid(
                "Heritage",
                "City",
                "Mountain",
                "Beach",
                "Nature",
                "Unique"
            )
            .required(),

        amenities: Joi.array()
            .items(Joi.string())
            .default([]),
            
            thingsToKnow: Joi.object({

    checkIn: Joi.string()
        .allow("")
        .default("12:00 PM"),

    checkOut: Joi.string()
        .allow("")
        .default("11:00 AM"),

    maxGuests: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(2),

    cancellationPolicy: Joi.string()
        .allow("")
        .default("Free cancellation for 24 hours."),

    houseRules: Joi.array()
        .items(Joi.string())
        .default([]),

    safety: Joi.array()
        .items(Joi.string())
        .default([])

}).default(),

    }).required()

});


module.exports.reviewSchema = Joi.object({

    review: Joi.object({

        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),

        comment: Joi.string()
            .required()

    }).required()

});