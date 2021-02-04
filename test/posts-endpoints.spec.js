const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const helpers = require("./helpers");

describe("Post Endpoints", () => {
  let db;
  const { testPosts, testUsers } = helpers.makeFixtures();
  const testPost = testPosts[0];
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());
  before("cleanup", () => helpers.cleanTables(db));
  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET /api/posts", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testPosts));

    it("responds 200, array of posts", () => {
      let expectedArray = [];
      expectedArray.push(helpers.makeExpectedPost(testPost));
      return supertest(app)
        .get("/api/posts")
        .expect(200)
        .expect((res) => {
          expect(res.body[0]).to.have.property("id");
          expect(res.body[0].title).to.eql(expectedArray[0].title);
          expect(res.body[0].content).to.eql(expectedArray[0].content);
          expect(res.body[0]).to.have.property("user_id");
        });
    });
  });

  describe("POST /api/posts", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testPosts));

    const requiredFields = ["title", "content"];
    requiredFields.forEach((field) => {
      const newPost = {
        title: "test new post",
        content: "test new content",
      };

      it(`responds 400 and error msg when '${field}' is missing`, () => {
        delete newPost[field];

        return supertest(app)
          .post("/api/posts")
          .send(newPost)
          .expect(400, {
            error: `Missing '${field}', in request body`,
          });
      });
    });

    it("responds 201 and created new post", () => {
      const newPost = {
        title: "test new post",
        content: "test new content",
      };

      return supertest(app)
        .post("/api/posts")
        .send(newPost)
        .expect(201)
        .then((res) => {
          expect(res.body.id).to.eql(5);
          expect(res.body.title).to.eql(newPost.title);
          expect(res.body.content).to.eql(newPost.content);
        });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousPost, expectedPost } = helpers.makeMaliciousPost();
      return supertest(app)
        .post("/api/posts")
        .send(maliciousPost)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(expectedPost.title);
          expect(res.body.content).to.eql(expectedPost.content);
        });
    });
  });

  describe("GET /api/posts/users/:user_id", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testPosts));

    context("given user doesn't exist or is not authorized", () => {
      it("responds 401, unauthroized request", () => {
        return supertest(app)
          .get("/api/posts/users/123456")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(401, {
            error: "Unauthorized request",
          });
      });
    });

    context("given proper authorization, but no liked posts", () => {
      it("responds 200, empty array", () => {
        return supertest(app)
          .get("/api/posts/users/3")
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(200, []);
      });
    });

    context("given proper authorization, user has posts", () => {
      it("responds 200, array of posts", () => {
        let expectedArray = [];
        expectedArray.push(helpers.makeExpectedPost(testPost));
        return supertest(app)
          .get("/api/posts/users/1")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body[0]).to.have.property("id");
            expect(res.body[0].title).to.eql(expectedArray[0].title);
            expect(res.body[0].content).to.eql(expectedArray[0].content);
            expect(res.body[0].user_id).to.eql(expectedArray[0].user_id);
          });
      });
    });
  });

  describe("PATCH /api/posts/:id", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testPosts));

    it("responds 400, req body must contain user_id", () => {
      return supertest(app)
        .patch("/api/posts/4")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send({})
        .expect(400, {
          error: "Request must contain the user_id",
        });
    });

    it("responds 204, no content", () => {
      const req = { user_id: 1, id: testPosts[3].id };
      const expectedPost = {
        ...testPosts[3],
        user_id: 1,
      };
      return supertest(app)
        .patch("/api/posts/4")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .send(req)
        .expect(204)
        .then((res) => {
          supertest(app)
            .get("/api/posts/users/1")
            .set("Authorization", helpers.makeAuthHeader(testUser))
            .then((res) => {
              expect(res.body).to.have.property("id");
              expect(res.body.title).to.eql(expectedPost.title);
              expect(res.body.content).to.eql(expectedPost.content);
              expect(res.body.user_id).to.eql(expectedPost.user_id);
            });
        });
    });
  });
});
