// ==============================
// Airbnb Clone - app.js (Memory Session, No MongoStore)
// ==============================

require('dotenv').config();

console.log("ATLASDB_URL:", process.env.ATLASDB_URL);
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();

// ==============================
// App Setup
// ==============================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ==============================
// MongoDB Connection
// ==============================
mongoose.connect(process.env.ATLASDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ==============================
// Session Setup (Memory Store for Dev)
// ==============================
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "mysupersecretcode",
    resave: false,
    saveUninitialized: false, // save empty session for new users
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 60, // 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(session(sessionOptions));
app.use(flash());

//passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // default username
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==============================
// Flash & Current User Middleware
// ==============================
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// ==============================
// Routes
// ==============================
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// ==============================
// 404 Handler
// ==============================
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// ==============================
// Start Server
// ==============================
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
});

