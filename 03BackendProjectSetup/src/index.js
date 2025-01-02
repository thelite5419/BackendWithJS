import 'dotenv/config';
import mongoose from "mongoose";
import {DB_NAME} from "../src/constants.js";
import connectDB from "./db/index.js";

import express from "express";
const app = express();

connectDB();



/*
;( async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error)=> {
            console.log('ERR :>> ', error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`app is listening on the port ::>> ${process.env.PORT}` );
        })
    } catch (error) {
        console.log('DB error :>> ', error);
    }
}) ()
*/