const express = require("express");
const UnsplashService = require("./unsplash-service");

const unsplashRouter = express.Router();
const { requireAuth } = require("../jwt");

unsplashRouter.route("/").get((req, res, next) => {
  UnsplashService.searchPhotos(req.query)
    .then((response) => res.status(200).send(response))
    .catch(next);
});

module.exports = unsplashRouter;
