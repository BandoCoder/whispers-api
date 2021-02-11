BEGIN;

TRUNCATE
  "likes",
  "posts",
  "users";

INSERT INTO "users" ("id", "user_name", "email", "password")
VALUES
  (
    1,
    'admin',
    'dund@gmail.com',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
    (
    2,
    'admin2',
    'dund2@gmail.com',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "posts" ("id", "title", "content", "date_created", "user_id")
VALUES
  (1, 'the test', 'this is the test for the first post', 1),
  (2, 'test two', 'this is the second post test', 1),
    (3, 'the test three', 'this is the test for the third post', 2),
  (4, 'test four', 'this is the fourth post test', 2);

INSERT INTO "likes" ("user_id", "post_id")
VALUES
  (1, 4),
  (1, 3),
  (2, 2),
  (2, 1);

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));
SELECT setval('posts_id_seq', (SELECT MAX(id) from "posts"));

COMMIT;