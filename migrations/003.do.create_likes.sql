CREATE TABLE likes (
    user_id INTEGER
        REFERENCES users(id) NOT NULL,
    post_id INTEGER
        REFERENCES posts(id) NOT NULL,
    unique(user_id, post_id)
)