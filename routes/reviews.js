const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const { reviewSchema}  = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//reviews
//post review route

router.post("/" ,isLoggedIn,validateReview , wrapAsync( reviewController.postReviewRoute));

// Delete Review route

router.delete("/:reviewId" ,isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReviewRoute));

module.exports = router;