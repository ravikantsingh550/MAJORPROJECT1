if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
  await mongoose.connect(MONGO_URL);
    
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const sessinOption = {
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie :{
        expires: Date.now() +7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};

// app.get("/" , (req, res)=>{
//     res.send("hii i am root");
// });

app.use(session(sessinOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req ,res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser" , async(req , res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//    let registerdUser = await User.register(fakeUser , "helloworld");
//    res.send(registerdUser);
// })

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs" , {err});
    // res.status(statusCode).send(message);
});

app.listen(port, ()=>{
    console.log("server is listing on port 8080");
})