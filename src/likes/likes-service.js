const LikesService = {
  getUserLikes(db, currUserId) {
    return db
      .select("*")
      .from("likes")
      .orderBy("date_created", "desc")
      .join("posts", "posts.id", "=", "likes.post_id")
      .where("likes.user_id", currUserId);
  },

  countLikesByPost(db, post_id) {
    return db.count("id").from("likes").where({ post_id });
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
