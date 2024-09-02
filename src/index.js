// this syntax don't maintain the consistany of the project so we use the import statement as below
//require('dotenv').config({path:'./env'}) // complete and corect syntax

import connectDB from "./db/index.js";
// always add the full name with extension like ./db/index.js

// for using this syntax we have to make the changes in the package.json file because it is the experimental feature of dotenv package. 
/*
 This syntax must be in the package.json file to use the import syntax

"scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules /index.js"
  },

*/
import dotenv from 'dotenv';
dotenv.config({ path: './env' });





connectDB();



























// Approch NO 1 for connecting DB 
// Approch N0 2 is better approch and the code is in another file and the preference is to use the 2nd approch as Production grade

/*
import express from "express"

const app = express();

// function connectDB(){}
//iff -> imediately invoked function 
// best practice -> add semicolon at start of iffe
;(async()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        app.on("error",(error)=>{
            console.log(error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${PORT}`);
            
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
})()


connectDB;

 */