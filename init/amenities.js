const mongoose = require("mongoose");
const Listing = require("../models/Listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayBee";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const result = await Listing.updateMany(
        {
            $or: [
                { amenities: { $exists: false } },
                { amenities: { $size: 0 } }
            ]
        },
        {
            $set: {
                amenities: [
                    "WiFi",
                    "Kitchen",
                    "Air Conditioning",
                    "Free Parking",
                    "TV"
                ]
            }
        }
    );

    console.log(`${result.modifiedCount} old listings updated`);

    await mongoose.connection.close();
}

main().catch(async (err) => {
    console.log(err);
    await mongoose.connection.close();
});