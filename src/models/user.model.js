import mongoose from "mongoose";

import { Collections } from "../database/collections.js";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessTokens: {
    type: [String],
    default: [],
  },
});

const UserModel = mongoose.model(Collections.users, userSchema);

export default UserModel;
