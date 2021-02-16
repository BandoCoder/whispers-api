require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

//Import Routers
const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const postsRouter = require("./posts/posts-router");
const likesRouter = require("./likes/likes-router");
const unsplashRouter = require("./unsplash/unsplash-router");

const app = express();

//Morgan Options
const morganOption = NODE_ENV === "production" ? "tiny" : "common";

// ** Middleware **

//Morgan for server logs during develoment
app.use(morgan(morganOption));
//Helmet for everything
app.use(helmet());
//Enable cors for ALL
app.use(cors());

// ** APP **

//Initialize Routers
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/photos", unsplashRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
