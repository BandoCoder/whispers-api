const express = require("express");
const path = require("path");
const PostsService = require("./posts-service");

const postsRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require("../jwt");

// ** Posts endpoints **

//Unauthorized route
postsRouter
  .route("/")
  .get((req, res, next) => {
    PostsService.getAllPosts(req.app.get("db"))
      .then((posts) => {
        res.status(200).json(PostsService.serializeAllPosts(posts));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content } = req.body;
    const newPost = { title, content };

    //Validate
    for (const field of ["title", "content"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}', in request body`,
        });

    //Insert post
    PostsService.insertPost(req.app.get("db"), newPost)
      .then((post) => {
        res.status(201).json(PostsService.serializePost(post));
      })
      .catch(next);
  });

postsRouter
  .route("/users/:user_id")
  .all(requireAuth)
  //Get posts liked by user
  .get((req, res, next) => {
    const currentUserId = req.user.id;

    if (currentUserId != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    PostsService.getUserLikedPosts(req.app.get("db"), currentUserId)
      .then((posts) => {
        res.status(200).json(PostsService.serializeAllPosts(posts));
      })
      .catch(next);
  });

postsRouter
  .route("/:id")
  .all(requireAuth)
  .patch(jsonParser, (req, res, next) => {
    const { user_id, id } = req.body;
    const postToUpdate = { user_id };

    //Validate
    const numOfValues = Object.values(postToUpdate).filter(Boolean).length;
    if (numOfValues === 0) {
      return res
        .status(400)
        .json({ error: "Request must contain the user_id" });
    }

    PostsService.updatePost(req.app.get("db"), id, postToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = postsRouter;
