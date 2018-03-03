var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comments")
var middleware = require("../middleware");

//*****************************************
//   COMMENT ROUTES
//*****************************************
//New Comment
router.get("/new", middleware.isLoggedIn,  function(req, res) {
    //find campgroud
    Campground.findById(req.params.id, function(err, campground)
    {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("comments/new", {campground:campground});
       }
    });
});


//create comment
router.post("/", middleware.isLoggedIn, function(req, res)
{
    //look up campground
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds")
        }
        else
        {
            //create new comment            
            Comment.create(req.body.comment, function(err, comment)
            {
               if(err)
               {
                   console.log(err)
                   res.redirect("/campgrounds");
               }
               else
               {
                   //add username and id
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save coment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   req.flash("success", "Successfully added comment");
                   res.redirect('/campgrounds/' + campground._id);
               }
            });
        }
    });
    //connect comment to campground
    //redirect to show.
});

//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res)
{
    Campground.findById(req.params.id, function(err, foundCampground) 
    {
        if(err || !foundCampground)
        {
            req.flash("error", "No Campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) 
        {
            if(err || !foundComment)
            {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else
            {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        
    });
        
    })
});

//update comment
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res)
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err)
    {
       if(err)
       {
           req.redirect("back");
       }
       else
       {
           req.flash("success", "Comment updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
    
});

//delete comment
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res)
{
   Comment.findByIdAndRemove(req.params.comment_id, function(err)
   {
     if(err)
     {
         res.redirect("back");
     }
     else
     {
         req.flash("success", "Comment deleted");
         res.redirect("/campgrounds/" + req.params.id);
     }
   });
});





module.exports = router;