const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const { reviewSchema}  = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");



const validateReview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400 , errMsg);
    }else{
        next();
    }
};



//reviews
//post review route

router.post("/" ,validateReview , wrapAsync( async(req , res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route

router.delete("/:reviewId" , wrapAsync(async(req , res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;