// require("dotenv").config()
import dotenv from "dotenv"
import mongoose from "mongoose";
import connectDB from "./db/index.js";
  

dotenv.config(
    {
        path:'./env'

    }
)

connectDB();


























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




