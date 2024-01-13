// require("dotenv").config()
import dotenv from "dotenv"
import mongoose from "mongoose";
import connectDB from "./db/index.js";
  import { app } from "./app.js";
dotenv.config(
    {
        path:'./env'

    }
)





connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`)
        })

})
    .catch((error) => {
    console.log(`Error connecting to the database or in MONGO DB Connection ${error}`); 
})


























/*
import express from "express";
const app = express();
; (async () => {
    // Connect to MongoDB.
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("errror", (error) => {
    console.log("errrr :", error)
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}...`);
        });
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }

})()
*/




