const User = require("../models/user");

// Render forms
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Signup
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect("/signup");
        }

        const newUser = new User({ username, email });

        // Register user with Passport
        const registeredUser = await User.register(newUser, password);

        // ✅ IMPORTANT: check if registration failed
        if (!registeredUser) {
            req.flash("error", "Registration failed. Maybe email already exists.");
            return res.redirect("/signup");
        }

        // Safely log the user in
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", `Welcome ${username}!`);
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Login
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Stayo!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    });
};
