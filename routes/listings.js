const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const{isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");



// index route and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,  validateListing ,  wrapAsync( listingController.createListing));


// new route
router.get("/new" ,isLoggedIn,listingController.renderNewForm);


//show route , update route and delete route
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, validateListing ,  wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.delete));




//edit route
router.get("/:id/edit" ,isLoggedIn,isOwner,  wrapAsync(listingController.edit));



module.exports = router;