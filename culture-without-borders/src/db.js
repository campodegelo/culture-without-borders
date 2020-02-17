// IMPORT POSTGRESQL
const spicedPg = require("spiced-pg");
const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/culture"
);

// QUERIES
/***********************************************************************/
// Get 10 latest books from a country
exports.getBooksByCountry = country => {
  return db
    .query(
      `SELECT * FROM books
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
      `SELECT * FROM authors
        WHERE country=$1 AND error=false
        ORDER BY id DESC LIMIT 10`,
      [country]
    )
    .then(({ rows }) => rows);
};
// Insert new book
exports.insertBook = (userId, author, bookName, image, url, country) => {
  return db
    .query(
      `INSERT INTO books (user_id, author, book_name, url, country)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
      [userId, author, bookName, image, url, country]
    )
    .then(({ rows }) => rows);
};
// Insert new author
exports.insertAuthor = (userId, author, image, url, country) => {
  return db
    .query(
      `INSERT INTO books (user_id, author, image, url, country)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`,
      [userId, author, image, url, country]
    )
    .then(({ rows }) => rows);
};
