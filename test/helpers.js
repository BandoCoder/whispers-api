const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      email: "test-user1@email.com",
      password: "Password123!",
    },
    {
      id: 2,
      user_name: "test-user-2",
      email: "test-user2@email.com",
      password: "Password123!",
    },
    {
      id: 3,
      user_name: "test-user-3",
      email: "test-user3@email.com",
      password: "Password123!",
    },
  ];
}

function makePostsArray() {
  return [
    {
      id: 1,
      title: "test-post-title-1",
      content: "test-post-content-1",
      img_url:
        "https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400",
      img_photographer: "Solen Feyissa",
      portfolio_url: "https://api.unsplash.com/users/solenfeyissa/portfolio",
      img_dwn_link: "https://api.unsplash.com/photos/nC2qCrKEUns/download",
      img_alt: "pink and white abstract painting",
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 1,
    },
    {
      id: 2,
      title: "test-post-title-2",
      content: "test-post-content-2",
      img_url:
        "https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400",
      img_photographer: "Solen Feyissa",
      portfolio_url: "https://api.unsplash.com/users/solenfeyissa/portfolio",
      img_dwn_link: "https://api.unsplash.com/photos/nC2qCrKEUns/download",
      img_alt: "pink and white abstract painting",
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 1,
    },
    {
      id: 3,
      title: "test-post-title-3",
      content: "test-post-content-3",
      img_url:
        "https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400",
      img_photographer: "Solen Feyissa",
      portfolio_url: "https://api.unsplash.com/users/solenfeyissa/portfolio",
      img_dwn_link: "https://api.unsplash.com/photos/nC2qCrKEUns/download",
      img_alt: "pink and white abstract painting",
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 2,
    },
    {
      id: 4,
      title: "test-post-title-3",
      content: "test-post-content-3",
      img_url:
        "https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400",
      img_photographer: "Solen Feyissa",
      portfolio_url: "https://api.unsplash.com/users/solenfeyissa/portfolio",
      img_dwn_link: "https://api.unsplash.com/photos/nC2qCrKEUns/download",
      img_alt: "pink and white abstract painting",
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 2,
    },
  ];
}

function makeLikesArray() {
  return [
    {
      user_id: 1,
      post_id: 1,
    },
    {
      user_id: 1,
      post_id: 2,
    },
    {
      user_id: 1,
      post_id: 3,
    },
  ];
}

function makeExpectedPost(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    img_url: post.img_url,
    img_photographer: post.img_photographer,
    portfolio_url: post.portfolio_url,
    img_dwn_link: post.img_dwn_link,
    img_alt: post.img_alt,
    date_created: post.date_created,
    user_id: post.user_id,
  };
}

function makeExpectedLike(like) {
  return {
    user_id: like.user_id,
    post_id: like.post_id,
  };
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testPosts = makePostsArray();
  const testLikes = makeLikesArray();
  return { testUsers, testPosts, testLikes };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        users,
        posts,
        likes
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('posts_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedLikes(db, likes) {
  const preppedLikes = likes.map((like) => ({
    ...like,
  }));
  return db.into("likes").insert(preppedLikes);
}

function seedPosts(db, users, likes, posts, userPosts) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("posts").insert(posts);
    await seedLikes(trx, likes);

    await trx.raw(`SELECT setval('posts_id_seq', ?)`, [
      posts[posts.length - 1].id,
    ]);
  });
}

function makeMaliciousPost() {
  const maliciousPost = {
    id: 111,
    title: 'malicious post title <script>alert("xss");</script>',
    content: 'malicious content <script>alert("xss");</script>',
    img_url: 'malicious content <script>alert("xss");</script>',
    img_photographer: 'malicious content <script>alert("xss");</script>',
    portfolio_url: 'malicious content <script>alert("xss");</script>',
    img_dwn_link: 'malicious content <script>alert("xss");</script>',
    img_alt: 'malicious content <script>alert("xss");</script>',
    user_id: 3,
  };

  const expectedPost = {
    ...maliciousPost,
    title: 'malicious post title &lt;script&gt;alert("xss");&lt;/script&gt;',
    content: 'malicious content &lt;script&gt;alert("xss");&lt;/script&gt;',
    img_url: 'malicious content &lt;script&gt;alert("xss");&lt;/script&gt;',
    img_photographer:
      'malicious content &lt;script&gt;alert("xss");&lt;/script&gt;',
    portfolio_url:
      'malicious content &lt;script&gt;alert("xss");&lt;/script&gt;',
    img_dwn_link:
      'malicious content &lt;script&gt;alert("xss");&lt;/script&gt;',
    img_alt: 'malicious content &lt;script&gt;alert("xss");&lt;/script&gt;',
  };

  return {
    maliciousPost,
    expectedPost,
  };
}

function seedMaliciousPost(db, user, post) {
  return seedUsers(db, [user]).then(() => db.into("posts").insert([post]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeFixtures,
  makeExpectedPost,
  cleanTables,
  seedUsers,
  seedPosts,
  seedLikes,
  makeExpectedLike,
  makeAuthHeader,
  makeMaliciousPost,
  seedMaliciousPost,
};
