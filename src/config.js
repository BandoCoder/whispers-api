module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://jbossen@localhost/whispers",
  JWT_SECRET: process.env.JWT_SECRET || "change-this.secret",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "3h",
  UNSPLASH_CLIENT_ID:
    process.env.CLIENT_ID ||
    "Client-ID 8ivrf3NlYhj5r4z9Ucnv-6kcmMq5SiVvKe06zs2zfOQ",
  UNSPLASH_URL:
    process.env.UNSPLASH_URL || "https://api.unsplash.com/search/photos",
};
