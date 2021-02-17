const config = require("../config");
const xss = require("xss");
const fetch = require("node-fetch");

const PostsService = {
  getAllPosts(db) {
    return db
      .from("posts")
      .select("*")
      .orderBy("date_created", "desc")
      .limit(50);
  },
  getAllPostsWithLikes(db) {
    return db("posts as p")
      .join("likes as l", "l.post_id", "=", "p.id")
      .select("*")
      .count("l.user_id as likes")
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
    return db.count("*").from("likes").where({ post_id });
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
  triggerDownload(img_dwn_link) {
    return fetch(`${img_dwn_link}`, {
      headers: {
        Authorization: `${config.UNSPLASH_CLIENT_ID}`,
        "Accept-Version": "v1",
        "content-type": "application/json",
      },
    }).then((response) =>
      !response.ok
        ? response.json().then((e) => Promise.reject(e))
        : response.json()
    );
  },
  serializeAllPosts(posts) {
    return posts.map(this.serializePost);
  },
};

module.exports = PostsService;
