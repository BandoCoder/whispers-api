const xss = require("xss");
const bcrypt = require("bcryptjs");

//Regex used for password format validation
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const REGEX_EMAIL = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db("users")
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },
  hasUserWithEmail(db, email) {
    return db("users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number, and special character";
    }
    return null;
  },
  validateEmail(email) {
    if (!REGEX_EMAIL.test(email)) {
      return "Email is invalid";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      email: xss(user.email),
    };
  },
};

module.exports = UsersService;
