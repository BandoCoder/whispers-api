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

INSERT INTO "posts" ("id", "title", "content", "img_url", "img_photographer", "portfolio_url", "img_dwn_link", "img_alt", "user_id")
VALUES
  (1, 'the test', 'this is the test for the first post', 'https://images.unsplash.com/photo-1611095785020-1ba3dd228ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MXwxfGFsbHwxfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400', 'DocuSign', 'https://api.unsplash.com/users/docusign/portfolio', 'https://api.unsplash.com/photos/5NJHUpmzD20/download', 'man in blue t-shirt reviewing contract on DocuSign from phone', 1),
  (2, 'test two', 'this is the second post test', 'https://images.unsplash.com/photo-1613072569184-2e7304cff8ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwyfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400', 'Solen Feyissa', 'https://api.unsplash.com/users/solenfeyissa/portfolio', 'https://api.unsplash.com/photos/nC2qCrKEUns/download', 'pink and white abstract painting', 1),
    (3, 'the test three', 'this is the test for the third post', 'https://images.unsplash.com/photo-1613085628218-d08b3a264f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHwzfHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400', 'Maksym Sirman', 'https://api.unsplash.com/users/makstron/portfolio', 'https://api.unsplash.com/photos/lEuxYh1kftg/download', 'brown jellyfish in black background', 2),
  (4, 'test four', 'this is the fourth post test', 'https://images.unsplash.com/photo-1613047880926-105f6e0662ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDYyMTF8MHwxfGFsbHw0fHx8fHx8Mnw&ixlib=rb-1.2.1&q=80&w=400', 'Maria Vojtovicova', 'http://maripopeo.com', 'https://api.unsplash.com/photos/7cfAzY0mj9w/download', 'blue and white light in dark room', 2);

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