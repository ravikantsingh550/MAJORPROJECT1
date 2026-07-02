const Listing = require("../models/listing.js");
const mapToken = process.env.MAP_TOKEN;

module.exports.index = async (req , res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs"  , {allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews" , populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error" , " Listing you requeted for dosn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});

};

module.exports.createListing = async (req , res)=>{
const location = req.body.listing.location;

const response = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${process.env.MAP_TOKEN}`
);

const data = await response.json();
console.log(data.features[0].geometry);


     let url = req.file.path;
     let filename = req.file.filename;
     let newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url  , filename};

    newListing.geometry = data.features[0].geometry;

    let saveListing =  await newListing.save();
    console.log(saveListing);
     req.flash("success" , "New Listing Created");
     res.redirect("/listings");  
};

module.exports.edit = async (req, res)=>{
        let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , " Listing you requeted for dosn't exist");
        return res.redirect("/listings");
    }
let originalImageUrl = listing.image.url;
 originalImageUrl=   originalImageUrl.replace("/upload" ,  "/upload/h_300,w_250");

    res.render("listings/edit.ejs" , {listing , originalImageUrl});
};

// module.exports.update = async (req, res)=>{
   
//     let {id} = req.params;
//    let listing =  await Listing.findByIdAndUpdate(id , {...req.body.listing});
     
//    if(typeof req.file !== "undefined"){
//      let url = req.file.path;
//      let filename = req.file.filename;
//      listing.image = {url  , filename};
//      await listing.save();
//    }
//     req.flash("success" , " Listing Updated");
//    res.redirect(`/listings/${id}`);
// };

module.exports.update = async (req, res) => {

    let {id} = req.params;

    // ====== Geocoding ======
    const location = req.body.listing.location;

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${process.env.MAP_TOKEN}`
    );

    const data = await response.json();
    // =======================

    let listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        geometry: {
            type: "Point",
            coordinates: data.features[0].geometry.coordinates
        }
    });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success" , " Listing Deleted");
    res.redirect("/listings");
};