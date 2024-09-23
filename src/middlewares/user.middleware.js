import jwt from "jsonwebtoken";

import UserModel from "../models/user.model.js";

const secretKey = process.env.SECRET_KEY;

const userMiddleware = {
  signUpValidation: async (req, res, next) => {
    try {
      const { userName, email, password, confirmPassword } = req.body;

      if (!userName) throw new Error("Username is required!");
      if (!email) throw new Error("Email is required!");
      if (!password) throw new Error("Password is required!");
      if (!confirmPassword) throw new Error("Confirm password is required!");
      if (confirmPassword !== password)
        throw new Error("Password and Confirm password do not match!");
      return next();
    } catch (error) {
      res.status(403).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  signInValidation: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email) throw new Error("Email is required!");
      if (!password) throw new Error("Password is required!");

      return next();
    } catch (error) {
      res.status(403).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  authValidation: async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
      res.status(403).send({
        message: "Access token is missing!",
        data: null,
        isSuccess: false,
      });

    const token = authorization.split(" ")[1];

    try {
      const payload = await jwt.verify(token, secretKey);

      const user = await UserModel.findById(payload.id);
      if (!user.accessTokens.find((accessToken) => accessToken === token))
        throw new Error("Access token is invalid!");

      req.user = { ...payload, token };

      return next();
    } catch (error) {
      if (error.message === "jwt expired") {
        await UserModel.findOneAndUpdate(
          { accessTokens: token },
          { $pull: { accessTokens: token } }
        );
      }

      res.status(403).send({
        message: error.message,
        data: null,
        isSuccess: false,
      });
    }
  },
};

export default userMiddleware;
