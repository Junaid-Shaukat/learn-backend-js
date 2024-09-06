import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile:{
        type:String,
        required:true,
    }
},{timestamps:true})

export const Video = mongoose.model("Video",videoSchema);
