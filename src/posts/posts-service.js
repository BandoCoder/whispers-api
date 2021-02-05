const xss = require("xss");
const { serializeUser } = require("../users/users-service");

const PostsService = {
  getAllPosts(db) {
    return db.from("posts").select("*").limit(50);
  },
  getUserPosts(db, user_id) {
    return db.from("posts").select("*").where({ user_id });
  },
  insertPost(db, post) {
    return db
      .insert(post)
      .into("posts")
      .returning("*")
      .then(([post]) => post);
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
    };
  },
  serializeAllPosts(posts) {
    return posts.map(this.serializePost);
  },
};

module.exports = PostsService;
