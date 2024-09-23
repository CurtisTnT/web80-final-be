import mongoose from "mongoose";

import { Collections } from "../database/collections.js";

const filmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  introduce: String,
});

filmSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

filmSchema.set("toJSON", { virtuals: true });
filmSchema.set("toObject", { virtuals: true });

const FilmModel = mongoose.model(Collections.films, filmSchema);

export default FilmModel;
