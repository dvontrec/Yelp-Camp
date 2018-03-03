var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//***************************
//     AUTH ROUTES
//****************************
//"/" route for landing page
router.get("/", function(req, res){
    res.render("landing" );
});

//register
router.get("/register", function(req, res) 
{
    res.render("register");
});

//on sucessful registration
router.post("/register", function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password, function(err, user)
    {
        if(err)
        {
            req.flash("error", err.message);
            return res.redirect("register");
        }
        else
        {
            passport.authenticate("local")(req, res, function()
            {
                req.flash("success", "welcome to yelp_camp" + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

//login
router.get("/login", function(req, res) {
    res.render("login");
});

//handles login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) 
    {
        
});

//logout rout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have logged out");
    res.redirect("/campgrounds");
});


module.exports = router;