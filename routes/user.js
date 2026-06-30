const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userContoller = require("../controllers/user.js");
const user = require("../models/user.js");


router.route("/signup")
.get( userContoller.renderSignUpform)
.post(wrapAsync( userContoller.signup))

router.route("/login")
.get(userContoller.renderLoginForm)
.post(saveRedirectUrl,  passport.authenticate("local" , {failureRedirect:"/login"  , failureFlash:true}) ,userContoller.login)




router.get("/logout" , userContoller.logout);

module.exports  = router;