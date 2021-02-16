const config = require("../config");
const fetch = require("node-fetch");

const UnsplashService = {
  searchPhotos(searchQuery) {
    console.log(searchQuery);
    return fetch(`${config.UNSPLASH_URL}?query=${searchQuery}`, {
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
};

module.exports = UnsplashService;
