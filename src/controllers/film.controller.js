import { v2 as cloudinary } from "cloudinary";

import FilmModel from "../models/film.model.js";

const filmController = {
  createFilm: async (req, res) => {
    try {
      const { name, time, year, introduce } = req.body;
      const image = req.file;

      const imageUrl = `data:${image.mimetype};base64,${image.buffer.toString(
        "base64"
      )}`;

      const uploadedFile = await cloudinary.uploader.upload(imageUrl, {
        public_id: imageUrl.originalname,
        resource_type: "auto",
        folder: "web08-final-term",
      });

      const saveUser = await FilmModel.create({
        name,
        time,
        year,
        image: uploadedFile.url,
        introduce,
      });

      res.status(201).send({
        isSuccess: true,
        data: saveUser,
        message: "Create new film successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  showFilm: async (req, res) => {
    try {
      const { id } = req.params;

      const existFilm = await FilmModel.findById(id);

      if (!existFilm) throw new Error("Film not found!");

      res.status(201).send({
        isSuccess: true,
        data: existFilm,
        message: "Get film successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  updateFilm: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, time, year, introduce } = req.body;
      const image = req.file;

      let newImageUrl = undefined;
      if (image) {
        const imageUrl = `data:${image.mimetype};base64,${image.buffer.toString(
          "base64"
        )}`;

        const uploadedFile = await cloudinary.uploader.upload(imageUrl, {
          public_id: imageUrl.originalname,
          resource_type: "auto",
          folder: "web08-final-term",
        });

        newImageUrl = uploadedFile.url;
      }

      const saveFilm = await FilmModel.findByIdAndUpdate(
        id,
        {
          name,
          time,
          year,
          image: newImageUrl,
          introduce,
        },
        {
          new: true,
        }
      );
      if (!saveFilm) throw new Error("Film not found!");

      res.status(201).send({
        isSuccess: true,
        data: saveFilm,
        message: "Update film successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  deleteFilm: async (req, res) => {
    try {
      const { id } = req.params;

      const existFilm = await FilmModel.findByIdAndDelete(id);
      if (!existFilm) throw new Error("Film not found!");

      res.status(201).send({
        isSuccess: true,
        data: existFilm,
        message: "Delete film successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  searchFilms: async (req, res) => {
    try {
      const { keyword } = req.body;

      let filterCondition = {};

      if (keyword) {
        filterCondition = {
          $or: [{ name: { $regex: keyword, $options: "i" } }],
        };
      }

      const films = await FilmModel.find(filterCondition);

      res.status(201).send({
        isSuccess: true,
        data: films,
        message: "Search film successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  sortFilmsByYear: async (req, res) => {
    try {
      const { sort = "asc" } = req.body;

      const films = await FilmModel.find().sort({
        year: sort === "asc" ? 1 : -1,
      });

      res.status(201).send({
        isSuccess: true,
        data: films,
        message: "Sort films by year successfully!",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },

  getList: async (req, res) => {
    try {
      const { pageNumber = 1, pageSize = 4 } = req.body;

      const totalItems = await FilmModel.countDocuments();
      const totalPages = Math.ceil(totalItems / pageSize);
      const skip = (pageNumber - 1) * pageSize;

      const films = await FilmModel.find().skip(skip).limit(pageSize);

      res.status(201).send({
        isSuccess: true,
        data: {
          totalItems,
          hasPrevPage: pageNumber > 1,
          hasNextPage: totalPages > pageNumber,
          totalPages,
          currentPage: pageNumber,
          items: films,
        },
        message: "Get films successfully!",
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

export default filmController;
