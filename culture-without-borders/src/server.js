// CONSTANT DECLARATIONS
const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const io = require("socket.io").listen(server);
const db = require("./db");
const goodreads = require("goodreads-api-node");
// const mapboxgl = require("mapbox-gl");

// HANDLING SECRETS
let secrets;
if (process.env.NODE_ENV === "production") {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

// COMPRESSION MIDDLEWARE
app.use(compression());

// STATIC FILES
app.use(express.static(__dirname + "../public"));

// REQ.BODY ACCESSIBILITY
app.use(
  express.urlencoded({
    extended: false
  })
);

// COOKIES HANDLES
const cookieSessionMiddleware = cookieSession({
  secret: secrets.SESSION_SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// SERVE JSON
app.use(express.json());

// CSURF MIDDLEWARE
app.use(csurf());
app.use(function(req, res, next) {
  res.cookie("mytoken", req.csrfToken());
  next();
});

/************** GOODREADS API *********************/
const myCredentials = {
  key: secrets.MY_GOODREADS_KEY,
  secret: secrets.MY_GOODREADS_SECRET
};
const gr = goodreads(myCredentials);

/************** GOODREADS API *********************/

/************** Multer - DO NOT TOUCH *********************/
const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});
/************** Multer - DO NOT TOUCH *********************/

/***********************************************************************/
// ROUTES
// GET /getBooksAndAuthors/:id
// Get the Books and Authors from a specific country
app.get("/getBooksAndAuthors/:id", (req, res) => {
  // retrieve information from the database
  (async () => {
    const books = await db.getBooksByCountry(req.params.id);
    const authors = await db.getAuthorsByCountry(req.params.id);
    console.log("books = ", books);
    console.log("authors = ", authors);
    res.json({
      books,
      authors
    });
  })();
});
// POST /searchBook
// search for books by name
app.post("/searchBook", (req, res) => {
  // gr.getBooksByAuthor("175417").then(console.log);
  console.log("book to be searched: ", req.body.book);
  // console.log(gr.searchBooks);
  gr.searchBooks({ query: req.body.book }).then(({ search }) => {
    console.log("search results = ", search.results.work);
    let arrayOfBooks = [];
    search.results.work.map(list => {
      // console.log("best_book = ", list.best_book);
      arrayOfBooks.push(list.best_book);
      return list.best_book;
    });
    console.log("arrayOfBooks: ", arrayOfBooks);
    // console.log("search results length = ", search.results.work.length);
    res.json(arrayOfBooks);
  });
});
// POST /searchBook
// search for books by name
app.post("/searchAuthor", (req, res) => {
  console.log("author to be searched: ", req.body.author);
  console.log("gr = ", gr);
  gr.searchAuthors(req.body.author).then(data => {
    console.log("data = ", data);
    console.log("search results = ", data.author);
    gr.getAuthorInfo(data.author.id).then(data => {
      console.log("search results = ", data);
      res.json(data);
    });
  });
});
// ALL ROUTES
// app.get("*", function(req, res) {
//   res.redirect("/maps");
// });
// app.get("/getMap", (req, res) => {
//   mapboxgl.accessToken = secrets.MAPBOX_ACCESS_TOKEN;
//   console.log('route /get');
//   const lng = 0,
//     lat = 0,
//     zoom = 1;
//   const map = new mapboxgl.Map({
//     container: this.mapContainer,
//     style: "mapbox://styles/mapbox/dark-v10",
//     center: [lng, lat],
//     zoom: zoom
//   });
//   res.json(map);
// });
/***********************************************************************/

//
// const gr = goodreads(myCredentials);
//
// // returns all books by an author given the authorID
// gr.getBooksByAuthor("175417").then(console.log);

/***********************************************************************/

server.listen(process.env.PORT || 8080, () => {
  console.log("Listening...");
});
