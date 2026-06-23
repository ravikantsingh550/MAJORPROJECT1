const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");

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

// index route
app.get("/listings" ,wrapAsync( async (req , res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs"  , {allListings});
}));

// new route
app.get("/listings/new" , (req, res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id" , wrapAsync(async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});

}));

// Create route
app.post("/listings" , wrapAsync( async (req , res)=>{
    if(! req.body.listing){
        throw new expressError(400 ,"send valid data for listings");
    }
     let newListing = new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
   

    
}));

//edit route
app.get("/listings/:id/edit" , wrapAsync(async (req, res)=>{
        let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

//update route
app.put("/listings/:id" , wrapAsync(async (req, res)=>{
    if(! req.body.listing){
        throw new expressError(400 ,"send valid data for listings");
    }
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id , {...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id" ,wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
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