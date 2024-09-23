import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";

const secretKey = process.env.SECRET_KEY;

const userController = {
  signUp: async (req, res) => {
    try {
      const { userName, email, password } = req.body;

      const existUser = await UserModel.findOne({ email });
      if (existUser) throw new Error("Email already exists!");

      const hashedPassword = bcrypt.hashSync(password, 10);

      await UserModel.create({
        userName,
        email,
        password: hashedPassword,
      });

      res.status(201).send({
        isSuccess: true,
        data: {
          userName,
          email,
        },
        message: "Sign up successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  signIn: async (req, res) => {
    try {
      const { authorization } = req.headers;
      const { email, password } = req.body;

      const existUser = await UserModel.findOne({ email });
      if (!existUser) throw new Error("Email or password is not valid!");

      const isPasswordCorrect = bcrypt.compareSync(
        password,
        existUser.password
      );

      if (!isPasswordCorrect)
        throw new Error("Email or password is not valid!");

      const accessToken = jwt.sign(
        {
          id: existUser._id,
          email,
          userName: existUser.userName,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      const curToken = authorization ? authorization.split(" ")[1] : "";
      const newAccessTokens = existUser.accessTokens.filter(
        (token) => token !== curToken
      );
      newAccessTokens.push(accessToken);

      await existUser.updateOne({ accessTokens: newAccessTokens });

      res.header("authorization", `Bearer ${accessToken}`);
      res.status(200).send({
        isSuccess: true,
        data: {
          accessToken,
        },
        message: "Sign in successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  signOut: async (req, res) => {
    try {
      const { user } = req;

      await UserModel.findByIdAndUpdate(user.id, {
        $pull: { accessTokens: user.token },
      });

      res.status(200).send({
        isSuccess: true,
        data: null,
        message: "Sign out successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },
};

export default userController;
