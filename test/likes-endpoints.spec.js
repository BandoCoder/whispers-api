const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const helpers = require("./helpers");

describe("Likes Endpoints", () => {
  let db;
  const { testPosts, testUsers, testLikes } = helpers.makeFixtures();
  const testPost = testPosts[0];
  const testUser = testUsers[0];
  const testLike = testLikes[0];

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

  describe("GET /api/likes/:user_id", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testLikes, testPosts));

    context("given user doesn't exist or is not authorized", () => {
      it("responds 401, unauthroized request", () => {
        return supertest(app)
          .get("/api/likes/123456")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(401, {
            error: "Unauthorized request",
          });
      });
    });

    context("given proper authorization, but no likes", () => {
      it("responds 200, empty array", () => {
        return supertest(app)
          .get("/api/likes/3")
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(200, []);
      });
    });

    context("given proper authorization, user has likes", () => {
      it("responds 200, array of posts", () => {
        let expectedArray = [];
        expectedArray.push(helpers.makeExpectedPost(testPost));
        return supertest(app)
          .get("/api/likes/1")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body[0]).to.have.property("id");
            expect(res.body[0].title).to.eql(expectedArray[0].title);
            expect(res.body[0].content).to.eql(expectedArray[0].content);
          });
      });
    });
  });
  describe("POST /api/likes/:user_id", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testLikes, testPosts));

    context("given user doesn't exist or is not authorized", () => {
      it("responds 401, unauthroized request", () => {
        const newLike = {
          user_id: 2,
          post_id: 3,
        };
        return supertest(app)
          .post("/api/likes/12345677")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(newLike)
          .expect(401, {
            error: "Unauthorized request",
          });
      });
    });

    context("given user is authorized", () => {
      it("responds 201 created like", () => {
        const newLike = {
          user_id: 2,
          post_id: 3,
        };
        return supertest(app)
          .post("/api/likes/2")
          .set("Authorization", helpers.makeAuthHeader(testUsers[1]))
          .send(newLike)
          .expect((res) => {
            expect(res.body.user_id).to.eql(newLike.user_id);
            expect(res.body.post_id).to.eql(newLike.post_id);
          });
      });
    });
  });
});
