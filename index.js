import express from "express";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import connectDatabase from "./src/database/db.js";
import RootRoute from "./src/routes/index.js";

const app = express();

//Middleware
app.use(express.json());
app.use(cors());

//Connect database
connectDatabase();

//Config cloudinary
const cloudinaryConfig = process.env.CLOUDINARY_CONFIG;
cloudinary.config(JSON.parse(cloudinaryConfig));

//Router
app.use("/api/v1", RootRoute);

//Running server
app.listen(8080, () => {
  console.log("Server is running!");
});
