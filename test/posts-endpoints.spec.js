const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const helpers = require("./helpers");

describe("Post Endpoints", () => {
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

  describe("GET /api/posts", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testLikes, testPosts));

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
        });
    });
  });

  describe("POST /api/posts/:user_id", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testLikes, testPosts));

    const requiredFields = [
      "title",
      "content",
      "img_url",
      "img_photographer",
      "portfolio_url",
      "img_dwn_link",
      "img_alt",
      "user_id",
    ];
    requiredFields.forEach((field) => {
      const newPost = {
        title: "test new post",
        content: "test new content",
        img_url:
          "https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400",
        img_photographer: "Solen Feyissa",
        portfolio_url: "https://api.unsplash.com/users/solenfeyissa/portfolio",
        img_dwn_link: "https://api.unsplash.com/photos/nC2qCrKEUns/download",
        img_alt: "pink and white abstract painting",
      };

      it(`responds 400 and error msg when '${field}' is missing`, () => {
        delete newPost[field];

        return supertest(app)
          .post("/api/posts/1")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
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
        img_url:
          "https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400",
        img_photographer: "Solen Feyissa",
        portfolio_url: "https://api.unsplash.com/users/solenfeyissa/portfolio",
        img_dwn_link: "https://api.unsplash.com/photos/nC2qCrKEUns/download",
        img_alt: "pink and white abstract painting",
        user_id: 1,
      };

      return supertest(app)
        .post("/api/posts/1")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newPost)
        .expect(201)
        .then((res) => {
          expect(res.body.id).to.eql(5);
          expect(res.body.title).to.eql(newPost.title);
          expect(res.body.content).to.eql(newPost.content);
          // expect(res.body.user_id).to.eql(newPost.user_id);
        });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousPost, expectedPost } = helpers.makeMaliciousPost();
      return supertest(app)
        .post("/api/posts/1")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(maliciousPost)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(expectedPost.title);
          expect(res.body.content).to.eql(expectedPost.content);
        });
    });
  });

  describe("GET /api/posts/:user_id", () => {
    beforeEach(() => helpers.seedPosts(db, testUsers, testLikes, testPosts));

    context("given user doesn't exist or is not authorized", () => {
      it("responds 401, unauthroized request", () => {
        return supertest(app)
          .get("/api/posts/123456")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(401, {
            error: "Unauthorized request",
          });
      });
    });

    context("given proper authorization, but no posts", () => {
      it("responds 200, empty array", () => {
        return supertest(app)
          .get("/api/posts/3")
          .set("Authorization", helpers.makeAuthHeader(testUsers[2]))
          .expect(200, []);
      });
    });

    context("given proper authorization, user has posts", () => {
      it("responds 200, array of posts", () => {
        let expectedArray = [];
        expectedArray.push(helpers.makeExpectedPost(testPost));
        return supertest(app)
          .get("/api/posts/1")
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
});
