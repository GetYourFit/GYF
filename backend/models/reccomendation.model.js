import mongoose from "mongoose";

const recommendSchema = new mongoose.Schema({
    Pic:{
        type:String,
        required:true
    },
    Budget:{
        type:String,
        required:true
    },
    Price:{
        type:Number,
        required:true
    },
    Prompt:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true
    },
    Occasion:{
        type:String,
        required:true
    },
    bodyType:{
        type:String,
        required:true
    }
})


export const Recommend = mongoose.model('Recommend', recommendSchema);