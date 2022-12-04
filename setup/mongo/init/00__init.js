/* This configuration is for the local development environment. */

const ADMIN_USERNAME = 'root';
const ADMIN_PASSWORD = 'root';
const ADMIN_DB = 'admin';

const LEMMA_DB = 'lemma';
const LEMMA_USER = 'lemma';
const LEMMA_PASSWORD = 'lemma';

db.auth(ADMIN_USERNAME, ADMIN_PASSWORD);

/* Setup the database for lemma service. */
db.createUser({
  user: LEMMA_USER,
  pwd: LEMMA_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: LEMMA_DB,
    },
  ],
});
