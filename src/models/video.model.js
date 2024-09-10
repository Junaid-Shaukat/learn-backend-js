import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile:{
        type:String, //cloudniary Url
        required:true,
    },
    thumbnail:{
        type:String, //cloudniary Url
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number, //cloudniary Url
        required:true
    }
},{timestamps:true})

export const Video = mongoose.model("Video",videoSchema);
