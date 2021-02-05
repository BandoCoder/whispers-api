const express = require("express");
const LikesService = require("./likes-service");

const likesRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require("../jwt");

likesRouter
  .route("/:user_id")
  .all(requireAuth)
  //Get posts liked by user
  .get((req, res, next) => {
    const currentUserId = req.user.id;

    if (currentUserId != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    LikesService.getUserLikes(req.app.get("db"), currentUserId)
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { user_id, post_id } = req.body;
    const newLike = { post_id, user_id };
    const currentUserId = req.user.id;

    if (currentUserId != req.params.user_id) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    //Validate
    for (const field of ["user_id", "post_id"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}', in request body`,
        });

    //Insert post
    LikesService.insertLike(req.app.get("db"), newLike)
      .then((like) => {
        res.status(201).json(like);
      })
      .catch(next);
  });

module.exports = likesRouter;
