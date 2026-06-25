const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

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

app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);

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