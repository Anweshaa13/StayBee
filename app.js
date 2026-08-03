if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const wishlistRouter = require("./routes/wishlist");
const bookingRouter = require("./routes/booking");
const Listing = require("./models/Listing");

// const MONGO_URL = "mongodb://127.0.0.1:27017/StayBee";
const MONGO_URL = process.env.ATLASDB_URL;


// ================= DATABASE =================

main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// ================= VIEW ENGINE =================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
   saveUninitialized : true,
    cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7* 24 * 60 * 60 * 1000,
    httpOnly: true,
    },
};




// ================= ROOT =================

// app.get("/", (req, res) => {
  //  res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(async (req, res, next) => {
    try {
        // Flash messages
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");

        // Current logged-in user
        res.locals.currUser = req.user;

        // Wishlist
        res.locals.wishlist = req.user?.wishlist || [];

        // By default, user is NOT a host
        res.locals.userIsHost = false;

        // If logged in, check whether they own a listing
        if (req.user) {
            const listing = await Listing.exists({
                owner: req.user._id
            });

            res.locals.userIsHost = !!listing;
        }

        next();

    } catch (err) {
        next(err);
    }
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/wishlist", wishlistRouter);
app.use("/bookings", bookingRouter);

// ================= 404 =================

app.all("*", (req, res, next) => {

    next(new ExpressError(404, "Page Not Found!"));

});

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {

    let { statusCode = 500 } = err;

    res.status(statusCode).render("error.ejs", { err });

});

// ================= SERVER =================

app.listen(8080, () => {

    console.log("Server is listening on port 8080");

});