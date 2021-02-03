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
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 1,
    },
    {
      id: 2,
      title: "test-post-title-2",
      content: "test-post-content-2",
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 2,
    },
    {
      id: 3,
      title: "test-post-title-3",
      content: "test-post-content-3",
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: 3,
    },
  ];
}

function makeExpectedPost(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    date_created: post.date_created,
    user_id: post.user_id,
  };
}

function makeFixtures() {
  const testUsers = makeUsersArray();
  const testPosts = makePostsArray();
  return { testUsers, testPosts };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        users,
        posts
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

function seedPosts(db, users, posts) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("posts").insert(posts);

    await trx.raw(`SELECT setval('posts_id_seq', ?)`, [
      posts[posts.length - 1].id,
    ]);
  });
}

function makeMaliciousPost() {
  const maliciousPost = {
    id: 111,
    title: 'malicious post title <script>alert("xss");</script>',
  };

  const expectedPost = {
    ...maliciousPost,
    title: 'malicious post title &lt;script&gt;alert("xss");&lt;/script&gt;',
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
  makeAuthHeader,
  makeMaliciousPost,
  seedMaliciousPost,
};
