const express = require("express");
const path = require("path");
const PostsService = require("./posts-service");

const postsRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require("../jwt");
const LikesService = require("../likes/likes-service");

// ** Posts endpoints **

//Unauthorized route
postsRouter.route("/").get((req, res, next) => {
  PostsService.getAllPosts(req.app.get("db"))
    .then((posts) => {
      res.status(200).json(PostsService.serializeAllPosts(posts));
    })
    .catch(next);
});

postsRouter
  .route("/:user_id")
  .all(requireAuth)
  //Get posts made by user
  .get((req, res, next) => {
    const currentUserId = req.user.id;

    if (currentUserId != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    PostsService.getUserPosts(req.app.get("db"), currentUserId)
      .then((posts) => {
        res.status(200).json(PostsService.serializeAllPosts(posts));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const currentUserId = req.user.id;
    const {
      title,
      content,
      img_url,
      img_photographer,
      portfolio_url,
      img_dwn_link,
      img_alt,
      user_id,
    } = req.body;
    const newPost = {
      title,
      content,
      img_url,
      img_photographer,
      portfolio_url,
      img_dwn_link,
      img_alt,
      user_id,
    };

    //Validate
    for (const field of [
      "title",
      "content",
      "img_url",
      "img_photographer",
      "img_dwn_link",
      "img_alt",
      "user_id",
    ])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}', in request body`,
        });
    if (currentUserId != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    //Insert post
    PostsService.insertPost(req.app.get("db"), newPost)
      .then((post) => {
        res.status(201).json(PostsService.serializePost(post));
      })
      .catch(next);
  });

postsRouter.route("/countlikes/:post_id").get((req, res, next) => {
  const currentPost = req.params.post_id;
  PostsService.countLikesByPost(req.app.get("db"), currentPost)
    .then((count) => res.status(200).json(count[0]))
    .catch(next);
});

module.exports = postsRouter;
