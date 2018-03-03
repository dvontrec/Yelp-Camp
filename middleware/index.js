// all the middlewar goes here
var Campground  = require("../models/campground");
var Comment     = require("../models/comments")
var middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req, res, next)
{
    //check if user is logged in 
    if(req.isAuthenticated())
    {
        //find campground user is trying to manage
        Campground.findById(req.params.id, function(err, foundCampground)
        {
            if(err || !foundCampground)
            {
                req.flash("error", "Campground does not exist");
                res.redirect("back");
            }
            else
            {
                //does user own campground
                if(foundCampground.author.id.equals(req.user._id))   //calls a mongoose function to compare objext with strings
                {
                    //carrys on to the desired next function
                    next();
                }
                else
                {
                    req.flash("error", "You do not own the rights to this campground");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//checks if the comment being altered is owned by current user
middlewareObj.checkCommentOwner = function(req, res, next)
{
    //check if user is logged in 
    if(req.isAuthenticated())
    {
        //find Comment user is trying to manage
        Comment.findById(req.params.comment_id, function(err, foundComment)
        {
            if(err || !foundComment)
            {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else
            {
                //does user own Comment
                if(foundComment.author.id.equals(req.user._id))   //calls a mongoose function to compare object with strings
                {
                    //carrys on to the desired next function
                    next();
                }
                else
                {
                    req.flash("error", "You do not have the permissions for this comment");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

//checks if user is loggged in
middlewareObj.isLoggedIn =  function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    else
    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login")
    }
}

module.exports = middlewareObj;