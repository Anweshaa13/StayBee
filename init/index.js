if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/Listing");
const maptiler = require("../cloudConfig/maptiler");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayBee";

main()
    .then(() => {
        console.log("Connected to DB");
        initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

    // Delete existing listings
    await Listing.deleteMany({});

    const data = [];

    // Add coordinates to every seed listing
    for (let obj of initData.data) {

        const fullAddress = `${obj.location}, ${obj.country}`;

        const result = await maptiler.geocoding.forward(fullAddress, {
            limit: 1,
        });

        let geometry = {
            type: "Point",
            coordinates: [],
        };

        if (result.features && result.features.length > 0) {
            geometry = {
                type: "Point",
                coordinates: result.features[0].geometry.coordinates,
            };
        }

        data.push({
            ...obj,
            geometry,
            owner: "6a50d616d814f313b3e48851",
        });
    }

    // Insert all listings
    await Listing.insertMany(data);

    console.log("Database Initialized!");
};