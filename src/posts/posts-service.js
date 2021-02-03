const xss = require("xss");
const { serializeUser } = require("../users/users-service");

const PostsService = {
  getAllPosts(db) {
    return db.from("posts").select("*").limit(50);
  },
  getUserLikedPosts(db, user_id) {
    return db.from("patterns").select("*").where({ user_id }).limit(50);
  },
  insertPost(db, post) {
    return db.insert(post).into("posts").reurning("*").limit(50);
  },
  removePost(db, id) {
    return db.from("posts").where({ id }).delete();
  },

  //Protect against cross site scripting
  serializePost(post) {
    return {
      id: post.id,
      title: xss(post.title),
      content: xss(post.content),
      user_id: post.user_id,
    };
  },
  serializeAllPosts(posts) {
    return posts.map(this.serializePost);
  },
};

module.exports = PostsService;
