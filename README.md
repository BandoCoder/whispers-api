# WHISPERS API

This is an api used to service the application called "Whispers". A user can post a whisper, and it saves it to a database on heroku.

[Live app]https://whispers.bandocoder.vercel.app/

[Client repository]https://github.com/BandoCoder/whispers-client

## Auth

| Method | Endpoint        | Usage               | Returns |
| ------ | --------------- | ------------------- | ------- |
| POST   | /api/auth/login | Authenticate a user | JWT     |

#### POST

Endpoint for authenticating a user

##### Request Body

| Type | Fields              | Description                                    |
| ---- | ------------------- | ---------------------------------------------- |
| JSON | user_name, password | JSON containing a username and password string |

##### Responses

| Code | Description                                                    |
| ---- | -------------------------------------------------------------- |
| 200  | Receive JWT with authenticated user_name and id inside payload |
| 400  | Missing '{user_name OR password}' in request body              |
| 400  | Incorrect user_name or password                                |

## User Registration

| Method | Endpoint   | Usage    | Returns     |
| ------ | ---------- | -------- | ----------- |
| POST   | /api/users | Register | User Object |

#### POST

Endpoint for registering new users

##### Request Body

| Type | Fields                     | Description                                       |
| ---- | -------------------------- | ------------------------------------------------- |
| JSON | user_name, email, password | JSON containing username, email, password strings |

##### Responses

| Code | Description                                                  |
| ---- | ------------------------------------------------------------ |
| 201  | Respond with object containing user data                     |
| 400  | Missing '{user_name OR email OR password}' in request body   |
| 400  | Error response object containing a validation error messages |

## Posts Endpoints

| Method | Endpoint             | Usage                    | Returns             |
| ------ | -------------------- | ------------------------ | ------------------- |
| POST   | /api/posts           | Create new post          | Post object         |
| GET    | /api/posts           | Get all posts            | Array of posts      |
| GET    | /api/posts/{user_id} | Get all Posts for a user | Array of user posts |

**Authorization required for all endpoints**

#### POST

Create new post

##### Request Body

| Type | Fields                                                                                   | Description                                                                |
| ---- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| JSON | title, content, img_url, img_photographer, portfolio_url, img_dwn_link, img_alt, user_id | Should be a json object, each field is required except for "portfolio_url" |

##### Responses

| Code | Description                                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------------------------- |
| 201  | Respond with post object and append user_id of the post to location.                                              |
| 400  | Missing '{title OR content OR img_url OR img_photographer OR img_dwn_link OR img_alt OR user_id}' in request body |
| 401  | Unauthorized Request                                                                                              |

#### `api/posts`

#### GET

Returns an array of post object

##### Responses

| Code | Description                                        |
| ---- | -------------------------------------------------- |
| 200  | Respond with array of post objects                 |
| 404  | Not Found (if this happens, your request is wrong) |
| 401  | Unauthorized Request                               |

#### `api/posts/:userId`

#### GET

Returns an array of post object for user

##### Responses

| Code | Description                                        |
| ---- | -------------------------------------------------- |
| 200  | Respond with array of post objects for user        |
| 404  | Not Found (if this happens, your request is wrong) |
| 401  | Unauthorized Request                               |

## Likes Endpoints

| Method | Endpoint             | Usage                    | Returns                    |
| ------ | -------------------- | ------------------------ | -------------------------- |
| POST   | /api/likes           | Create new like          | Array of users liked posts |
| GET    | /api/likes/{user_id} | Get all Posts for a user | Array of users liked posts |

**Authorization required for all endpoints**

#### POST

Create new Like

##### Request Body

| Type | Fields           | Description                                     |
| ---- | ---------------- | ----------------------------------------------- |
| JSON | user_id, post_id | Should be a json object, each field is required |

##### Responses

| Code | Description                                  |
| ---- | -------------------------------------------- |
| 201  | Respond with array of users liked posts      |
| 400  | Missing '{user_id, post_id}' in request body |
| 401  | Unauthorized Request                         |

#### `api/likes/`

#### GET

Returns an array of posts objects

##### Responses

| Code | Description                                        |
| ---- | -------------------------------------------------- |
| 200  | Respond with array of post objects                 |
| 404  | Not Found (if this happens, your request is wrong) |
| 401  | Unauthorized Request                               |

#### `api/likes/:userId`

#### GET

Returns an array of posts liked by user

##### Responses

| Code | Description                                        |
| ---- | -------------------------------------------------- |
| 200  | Respond with array of post objects for user likes  |
| 404  | Not Found (if this happens, your request is wrong) |
| 401  | Unauthorized Request                               |

## Unsplash Endpoints (proxy)

This is an endpoint that allows you to query the unsplash api for photos.

**You must apply for your own CLIENT ID through unsplash**
[Refer to the Unsplash API documentation by clicking here!](https://unsplash.com/documentation)

#### Api Endpoint Url

https://api.unsplash.com/search/photos

| Method | Endpoint                     | Usage             | Returns         |
| ------ | ---------------------------- | ----------------- | --------------- |
| GET    | /photos?query=${searchQuery} | Search for photos | Array of photos |

There is no delete endpoint. You must use sql to delete.

## Tech

Node.js

Express

Knex

Postgres

SQL

Postgrator
