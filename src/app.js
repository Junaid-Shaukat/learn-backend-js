import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
// app.use -> it is used to add middleware
// data coming limit or configuration
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public")) // public is the folder name which is used to store files like favicon
app.use(cookieParser())


export {app}  