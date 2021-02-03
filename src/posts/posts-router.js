const express = require("express");
const path = require("path");
const PostsService = require("./posts-service");

const postsRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require("../jwt");

// ** Posts endpoints **

//GET all posts
postsRouter.route("/").get((req, res, next) => {
  PostsService.getAllPosts(req.app.get("db")).then((posts) => {
    res.status(200).json(PostsService.serializeAllPosts(posts));
  });
});

module.exports = postsRouter;
