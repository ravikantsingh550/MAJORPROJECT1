
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

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
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing" ,listingSchema);

module.exports = Listing;