const filmMiddleware = {
  createFilmValidation: async (req, res, next) => {
    try {
      const { name, time, year } = req.body;
      const image = req.file;

      if (!name) throw new Error("Name is required!");
      if (!time) throw new Error("Time is required!");
      if (!year) throw new Error("Year is required!");
      if (!image) throw new Error("Image is required!");

      return next();
    } catch (error) {
      res.status(403).send({
        isSuccess: false,
        data: null,
        message: error.message,
      });
    }
  },
};

export default filmMiddleware;
