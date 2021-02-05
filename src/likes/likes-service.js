const LikesService = {
  getUserLikes(db, currUserId) {
    return db
      .select("*")
      .from("likes")
      .join("posts", "posts.id", "=", "likes.post_id")
      .where("likes.user_id", currUserId);
  },

  insertLike(db, like) {
    return db
      .insert(like)
      .into("likes")
      .returning("*")
      .then(([like]) => like);
  },
};

module.exports = LikesService;
