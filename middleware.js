const passport = require("passport");


module.exports.isLoggedIn = (req , res  ,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error" , ("you must be looged in to create listing"));
        return  res.redirect("/login");
    }
    next();
}