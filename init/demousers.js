const mongoose = require("mongoose");
const User = require("../models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/StayBee";

const demoUsers = [
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

async function main() {

    await mongoose.connect(MONGO_URL);

    console.log("Connected to database");

    for (const username of demoUsers) {

        // Don't create duplicate accounts
        const existingUser = await User.findOne({
            username
        });

        if (existingUser) {
            console.log(`${username} already exists`);
            continue;
        }

        const user = new User({
            username,

            // Use this only if email exists in your User schema
            email: `${username}@staybee.demo`
        });

        await User.register(
            user,
            "Demo@123"
        );

        console.log(`Created: ${username}`);
    }

    console.log("Demo users created!");

    await mongoose.connection.close();
}

main().catch(async (err) => {

    console.error(err);

    await mongoose.connection.close();

});