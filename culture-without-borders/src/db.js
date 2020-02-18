// IMPORT POSTGRESQL
const spicedPg = require("spiced-pg");
const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/culture"
);

// QUERIES
/***********************************************************************/
// SELECT INFORMATION ABOUT USER
exports.getUserInfo = id => {
  return db
    .query(
      `SELECT * FROM users
            WHERE id=$1`,
      [id]
    )
    .then(({ rows }) => rows);
};
// INSERT a new user in the table users
exports.insertNewUser = (first, last, countryCode, email, password) => {
  return db
    .query(
      `INSERT INTO users (first, last, email, password, nationality)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`,
      [first, last, email, password, countryCode]
    )
    .then(({ rows }) => rows);
};
// if user is already registered, it will return its password to be compared
exports.userExists = emailToCheck => {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [emailToCheck])
    .then(({ rows }) => rows);
};
// Get 10 latest books from a country
exports.getBooksByCountry = country => {
  return db
    .query(
      `SELECT *,
      (
          SELECT id from books
          WHERE country=$1 AND error=false
          ORDER BY id ASC
          LIMIT 1
      ) AS "lowestId"
       FROM books
      WHERE country=$1 AND error=false
      ORDER BY id DESC LIMIT 10`,
      [country]
    )
    .then(({ rows }) => rows);
};
// Get 10 latest authors from a country
exports.getAuthorsByCountry = country => {
  return db
    .query(
      `SELECT *,
      (
          SELECT id from authors
          WHERE country=$1 AND error=false
          ORDER BY id ASC
          LIMIT 1
      ) AS "lowestId"
       FROM authors
        WHERE country=$1 AND error=false
        ORDER BY id DESC LIMIT 10`,
      [country]
    )
    .then(({ rows }) => rows);
};
// Insert new book
exports.insertBooks = (userId, author, bookName, bookId, image, country) => {
  return db
    .query(
      `INSERT INTO books (user_id, author, book_name, book_id, image, country)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
      [userId, author, bookName, bookId, image, country]
    )
    .then(({ rows }) => rows);
};
// Insert new author
exports.insertAuthor = (userId, author, image, url, country) => {
  return db
    .query(
      `INSERT INTO authors (user_id, author, image, url, country)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [userId, author, image, url, country]
    )
    .then(({ rows }) => rows);
};
// get the last 5 books from a specific country
exports.getLatestBooks = countryId => {
  return db
    .query(
      `SELECT * FROM books
        WHERE country=$1
        ORDER BY id DESC LIMIT 5`,
      [countryId]
    )
    .then(({ rows }) => rows);
};
// get the last 5 authors from a specific country
exports.getLatestAuthors = countryId => {
  return db
    .query(
      `SELECT * FROM authors
        WHERE country=$1
        ORDER BY id DESC LIMIT 5`,
      [countryId]
    )
    .then(({ rows }) => rows);
};
// get more authors from the table => MORE BUTTON
exports.moreAuthors = lastId => {
  return db
    .query(
      `SELECT *, (
                SELECT id FROM authors
                ORDER BY id ASC
                LIMIT 1
            ) AS "lowestId" FROM authors
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 10;`,
      [lastId]
    )
    .then(({ rows }) => rows);
};
// get more books from the table => MORE BUTTON
exports.moreBooks = lastId => {
  return db
    .query(
      `SELECT *, (
                SELECT id FROM books
                ORDER BY id ASC
                LIMIT 1
            ) AS "lowestId" FROM books
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 10;`,
      [lastId]
    )
    .then(({ rows }) => rows);
};
