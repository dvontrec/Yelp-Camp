var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//***************************************
//          COMMENT ROUTES
//***************************************

// INDEX
//"/campgrounds"
router.get("/", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
       }
    });
});


//create route
router.get("/new", middleware.isLoggedIn,  function(req, res) {
    res.render("campgrounds/new") 
});

//new route
//"/campgrounds" POST
router.post("/", middleware.isLoggedIn,  function(req, res){
     //get data from form
     var name = req.body.name;
     var price =  req.body.price;
     var image = req.body.image;
     var description = req.body.description;
     //create author for campground
     var author = 
     {
         id: req.user._id,
         username: req.user.username
     }
     //add to campgrounds array
     var newCampground = {name:name, price:price, image:image, description:description, author:author};
     //create new campground to db
     Campground.create(newCampground, function(err, newlyCreated){
         if(err || !newlyCreated){
             console.log(err)
         }
         else{
             //redirect back to campgrounds page
             res.redirect("campgrounds")
         }
     });
});


//SHOW - shows more info about one campground
router.get("/:id", function(req, res) {
    //find camp by id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
    {
        if(err || !foundCampground)
        {
            req.flash("error","campground not found");
            res.redirect("back");
        }
        else
        {
            //render show template
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res) 
{
    Campground.findById(req.params.id, function(err, foundCampground)
    {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
            
}); 

//update
router.put("/:id", middleware.checkCampgroundOwner, function(req, res)
{
    //find and update campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground)
    {
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//destroy route
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res)
{
    Campground.findByIdAndRemove(req.params.id, function(err)
    {
        res.redirect("/campgrounds");
    });
});



module.exports = router;