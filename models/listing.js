
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    image:{
         
        type:String,
        default:"https://unsplash.com/photos/a-dramatic-sunset-over-a-rocky-beach-with-waves-cinHuA8-WRs",
        set:(v)=> v === ""? "https://unsplash.com/photos/a-dramatic-sunset-over-a-rocky-beach-with-waves-cinHuA8-WRs":v,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing" ,listingSchema);

module.exports = Listing;