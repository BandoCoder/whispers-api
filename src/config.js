module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://iakfxmqwpicnuw:6585a7fe3ad68832958363148e087b373b86abf02fd361e2eb1a38e86caeb5a2@ec2-54-198-73-79.compute-1.amazonaws.com:5432/dpt2sjkg2ggnu",
  JWT_SECRET: process.env.JWT_SECRET || "change-this.secret",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30m",
  UNSPLASH_CLIENT_ID:
    process.env.CLIENT_ID ||
    "Client-ID 8ivrf3NlYhj5r4z9Ucnv-6kcmMq5SiVvKe06zs2zfOQ",
  UNSPLASH_URL:
    process.env.UNSPLASH_URL || "https://api.unsplash.com/search/photos",
};
