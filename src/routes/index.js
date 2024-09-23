import { Router } from "express";

import UserRoute from "./user.route.js";
import FilmRoute from "./film.route.js";

const RootRoute = Router();

RootRoute.use("/users", UserRoute);

RootRoute.use("/films", FilmRoute);

export default RootRoute;
