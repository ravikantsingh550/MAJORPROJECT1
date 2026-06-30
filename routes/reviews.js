const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const { reviewSchema}  = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");



//reviews
//post review route

router.post("/" ,isLoggedIn,validateReview , wrapAsync( async(req , res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success" , "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route

router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor, wrapAsync(async(req , res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success" , "Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;