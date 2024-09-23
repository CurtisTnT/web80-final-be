import { Router } from "express";
import multer from "multer";

import userMiddleware from "../middlewares/user.middleware.js";
import filmMiddleware from "../middlewares/film.middleware.js";
import filmController from "../controllers/film.controller.js";

const FilmRoute = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

FilmRoute.post(
  "",
  userMiddleware.authValidation,
  upload.single("image"),
  filmMiddleware.createFilmValidation,
  filmController.createFilm
);

FilmRoute.get(
  "/search",
  userMiddleware.authValidation,
  filmController.searchFilms
);

FilmRoute.get(
  "/sort-films-by-year",
  userMiddleware.authValidation,
  filmController.sortFilmsByYear
);

FilmRoute.get("/list", filmController.getList);

FilmRoute.get("/:id", userMiddleware.authValidation, filmController.showFilm);

FilmRoute.put(
  "/:id",
  userMiddleware.authValidation,
  upload.single("image"),
  filmController.updateFilm
);

FilmRoute.delete(
  "/:id",
  userMiddleware.authValidation,
  filmController.deleteFilm
);

export default FilmRoute;
