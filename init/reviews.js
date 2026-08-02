const mongoose = require("mongoose");

const Listing = require("../models/Listing");
const Review = require("../models/review");
const User = require("../models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayBee";

const demoUsernames = [
    "riya_sharma",
    "arjun_mehta",
    "neha_kapoor",
    "rohan_verma",
    "ishita_singh",
    "aditya_jain",
    "kavya_gupta",
    "siddharth_rao",
    "meera_nair",
    "aryan_malhotra",
    "tanvi_shah",
    "dev_patel",
    "ananya_iyer",
    "kabir_khanna",
    "sneha_reddy",
    "rahul_bose",
    "diya_agarwal",
    "varun_saxena",
    "nisha_menon",
    "yash_chopra"
];

const comments = [
    "Beautiful property and a very comfortable stay.",
    "The location was amazing and everything was exactly as described.",
    "Really peaceful place. Perfect for a relaxing weekend.",
    "The rooms were clean and the property was well maintained.",
    "Loved the location and the overall experience.",
    "Great stay! Would definitely recommend this place.",
    "The property was beautiful and check-in was very smooth.",
    "Very comfortable stay with all the necessary amenities.",
    "The surroundings were absolutely beautiful.",
    "A lovely place for a weekend getaway with friends.",
    "The host was helpful and the property was clean.",
    "Great location and a very cozy place to stay.",
    "The view from the property was absolutely stunning.",
    "Everything was clean, comfortable and well organized.",
    "Really enjoyed our stay. Would love to visit again.",
    "The property looked exactly like the photos.",
    "Peaceful atmosphere and a great location.",
    "The rooms were spacious and comfortable.",
    "Perfect place for a short vacation.",
    "One of the best stays I've had. Highly recommended."
];

function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

async function seedReviews() {

    await mongoose.connect(MONGO_URL);

    console.log("Connected to StayBee");


    // =========================================
    // GET LISTINGS
    // =========================================

    const listings = await Listing.find({});


    // =========================================
    // GET ONLY OUR DEMO USERS
    // =========================================

    const demoUsers = await User.find({
        username: {
            $in: demoUsernames
        }
    });


    console.log(`Listings found: ${listings.length}`);
    console.log(`Demo users found: ${demoUsers.length}`);


    if (demoUsers.length < 4) {

        console.log(
            "Not enough demo users found. Run demoUsers.js first."
        );

        await mongoose.connection.close();
        return;
    }


    // =========================================
    // REMOVE OLD REVIEWS
    // =========================================

    console.log("Removing old reviews...");

    await Review.deleteMany({});


    // Remove old review references from listings

    await Listing.updateMany(
        {},
        {
            $set: {
                reviews: []
            }
        }
    );


    console.log("Old reviews removed.");


    // =========================================
    // CREATE REVIEWS FOR EACH LISTING
    // =========================================

    for (const listing of listings) {

        // Each listing gets 4–7 reviews

        const reviewCount =
            Math.floor(Math.random() * 4) + 4;


        // Shuffle users so a user isn't repeated
        // on the SAME listing

        const shuffledUsers =
            shuffle(demoUsers);


        // Shuffle comments too

        const shuffledComments =
            shuffle(comments);


        console.log(
            `Adding ${reviewCount} reviews to ${listing.title}`
        );


        for (let i = 0; i < reviewCount; i++) {

            const user =
                shuffledUsers[i];

            const comment =
                shuffledComments[i];


            // Mostly 4–5 stars

            const rating =
                Math.random() < 0.7 ? 5 : 4;


            // Random date within last ~6 months

            const daysAgo =
                Math.floor(
                    Math.random() * 180
                );


            const createdAt =
                new Date(
                    Date.now() -
                    daysAgo *
                    24 *
                    60 *
                    60 *
                    1000
                );


            const review =
                new Review({

                    author: user._id,

                    comment,

                    rating,

                    createdAt

                });


            await review.save();


            listing.reviews.push(
                review._id
            );
        }


        await listing.save();
    }


    console.log(
        "All listings reseeded successfully!"
    );


    await mongoose.connection.close();
}


seedReviews().catch(async (err) => {

    console.error(err);

    await mongoose.connection.close();

});