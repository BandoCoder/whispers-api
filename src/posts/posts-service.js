const xss = require("xss");

const PostsService = {
  getAllPosts(db) {
    return db
      .from("posts")
      .select("*")
      .orderBy("date_created", "desc")
      .limit(50);
  },
  getUserPosts(db, user_id) {
    return db
      .from("posts")
      .select("*")
      .orderBy("date_created", "desc")
      .where({ user_id });
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
  countLikesByPost(db, post_id) {
    return db.count("post_id").from("likes").where({ post_id });
  },

  //Protect against cross site scripting
  serializePost(post) {
    return {
      id: post.id,
      title: xss(post.title),
      content: xss(post.content),
      img_url: xss(post.img_url),
      img_photographer: xss(post.img_photographer),
      portfolio_url: xss(post.portfolio_url),
      img_dwn_link: xss(post.img_dwn_link),
      img_alt: xss(post.img_alt),
      date_created: post.date_created,
    };
  },
  serializeAllPosts(posts) {
    return posts.map(this.serializePost);
  },
};

module.exports = PostsService;
