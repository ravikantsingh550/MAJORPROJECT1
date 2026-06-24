const { string, date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema  = new Schema({
    comment:string,
    rating:{
        type:number,
        min:1,
        max:5
    },
    createAt:{
        type:date,
        default: date.now(),
    }
});
module.exports = mongoose.models("Review" , reviewSchema );