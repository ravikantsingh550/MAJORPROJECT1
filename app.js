const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema , reviewSchema}  = require("./schema.js");
const Review = require("./models/reviews.js");
const listings = require("./routes/listings.js");

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

app.get("/" , (req, res)=>{
    res.send("hii i am root");
});



const validateReview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400 , errMsg);
    }else{
        next();
    }
};

app.use("/listings" , listings);



//reviews
//post review route

app.post("/listings/:id/reviews" ,validateReview , wrapAsync( async(req , res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review route

app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req , res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


// app.get("/testlisting" , async (req , res)=>{
//     let sampleListing = new Listing({
//         title: "my new villa",
//         discription: "by the beach",
//         price:1200,
//         location: "calangaute , Goa",
//         country: "India,"
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("sucessful testing");
// })

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