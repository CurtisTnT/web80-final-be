import { Router } from "express";

import userMiddleware from "../middlewares/user.middleware.js";
import userController from "../controllers/user.controller.js";

const UserRoute = Router();

UserRoute.post(
  "/sign-up",
  userMiddleware.signUpValidation,
  userController.signUp
);

UserRoute.post(
  "/sign-in",
  userMiddleware.signInValidation,
  userController.signIn
);

UserRoute.post(
  "/sign-out",
  userMiddleware.authValidation,
  userController.signOut
);

export default UserRoute;
