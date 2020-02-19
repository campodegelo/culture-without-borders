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
const { compare, hash } = require("./bcrypt");
const db = require("./db");
const goodreads = require("goodreads-api-node");
const axios = require("axios");

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

// COOKIES HANDLER
const cookieSessionMiddleware = cookieSession({
  secret: secrets.SESSION_SECRET,
  maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
  cookieSessionMiddleware(socket.request, socket.request.res, next);
});
//
// // SERVE JSON
app.use(express.json());
//
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

axios.create({
  xsrfCookieName: "mytoken",
  xsrfHeaderName: "csrf-token"
});

/************** Multer - DO NOT TOUCH *********************/

/***********************************************************************/
// ROUTES
// GET - /getMap
// app.get("/getMap", (req, res) => {
//   const mapboxgl = require("mapbox-gl");
//   mapboxgl.accessToken =
//     "pk.eyJ1IjoiY2FtcG9kZWdlbG8iLCJhIjoiY2s2b3lpdDJwMDkzaTNrcW8weno3ZzljciJ9.ggdQUJLnLnWQ92IjWlFK5g";
//   const map = new mapboxgl.Map({
//     container: this.mapContainer,
//     // style: "mapbox://styles/mapbox/dark-v10",
//     // style: "mapbox://styles/campodegelo/ck6peiqju12nc1is9h04l2lg3",
//     style: "mapbox://styles/campodegelo/ck6pf5nj012wt1io6pt1i2cb9",
//     center: [0, 0],
//     zoom: 1
//   });
//   res.json({ map: map });
// });
// USER - GET
app.get("/user", (req, res) => {
  db.getUserInfo(req.session.userId)
    .then(data => {
      // console.log("user data from getUserInfo: ", data);
      res.json(data[0]);
    })
    .catch(err => console.log("err in getUserInfo: ", err));
});
// REGISTER - POST
app.post("/register", (req, res) => {
  const { first, last, email, countryCode, password, confirm } = req.body;
  console.log("Input to /register : ", req.body);
  // check for empty inputs
  if (!first || !last || !email || !password || !confirm || !countryCode) {
    // console.log("empty input");
    res.json({
      success: false
    });
  } else {
    // check if type pwd and the confirmation match
    if (!(password === confirm)) {
      res.json({
        success: false
      });
    } else {
      // check if email is already registered
      db.userExists(email).then(data => {
        if (data.length > 0) {
          // user is already in the db
          res.json({
            success: false
          });
        } else {
          // hash the password
          hash(password).then(hashedPass => {
            // console.log("password hashed");
            db.insertNewUser(first, last, countryCode, email, hashedPass)
              .then(data => {
                // set a cookie for the new user
                req.session.userId = data[0].id;
                res.json({
                  success: true
                });
              })
              .catch(err => console.log("err in insertNewUser : ", err));
          });
        }
      });
    }
  }
});
// LOGIN - POST
app.post("/login", (req, res) => {
  db.userExists(req.body.email).then(data => {
    // if results array > 0, means the user was found in the db
    if (data.length > 0) {
      const userId = data[0].id;
      compare(req.body.password, data[0].password).then(data => {
        if (data) {
          // password is correct and cookie will be created
          req.session.userId = userId;
          res.json({
            success: true
          });
        } else {
          // passwords do not match
          res.json({
            success: false
          });
        }
      });
    } else {
      // user is not registered
      res.json({
        success: false
      });
    }
  });
});
// LOGOUT - GET
app.get("/logout", (req, res) => {
  req.session.userId = null;
  delete req.session;
  res.redirect("/");
});
// GET /getBooksAndAuthors/:id
// Get the Books and Authors from a specific country
app.get("/getBooksAndAuthors/:id", (req, res) => {
  // retrieve information from the database
  (async () => {
    const books = await db.getBooksByCountry(req.params.id);
    const authors = await db.getAuthorsByCountry(req.params.id);
    // console.log("books = ", books);
    // console.log("authors = ", authors);
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
  gr.searchBooks({ query: req.body.book })
    .then(({ search }) => {
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
    })
    .catch(e => {
      console.log("error in searching books: ", e);
      res.json({ status: "not-found" });
    });
});
// POST /searchBook
// search for books by name
app.post("/searchAuthor", (req, res) => {
  console.log("author to be searched: ", req.body.author);
  console.log("gr = ", gr);
  gr.searchAuthors(req.body.author)
    .then(data => {
      console.log("data = ", data);
      console.log("search results = ", data.author);
      gr.getAuthorInfo(data.author.id)
        .then(data => {
          console.log("search results = ", data);
          res.json(data);
        })
        .catch(e => {
          console.log("error in searching authors: ", e);
          res.json({ status: "not-found" });
        });
    })
    .catch(e => {
      console.log("error in searching authors: ", e);
      res.json({ status: "not-found" });
    });
});
// POST / addAuthor
// insert an author to the table for the specified country
app.post("/addAuthor", (req, res) => {
  console.log("item to be inserted: ", req.body.author);
  console.log("country: ", req.body.country);
  const { author, country } = req.body;
  db.insertAuthor(
    req.session.userId,
    author.name,
    author.image_url,
    author.link,
    country
  )
    .then(data => {
      console.log("data from /insertAuthor : ", data);
      res.json({
        success: true
      });
    })
    .catch(e => {
      console.log("error in /insertAuthor : ", e);
      res.json({
        success: false
      });
    });
});
// POST / addBoks
// insert selected book in the table for the specified country
app.post("/addBooks", (req, res) => {
  console.log("item to be inserted: ", req.body.books);
  console.log("country: ", req.body.country);
  const { books, country } = req.body;
  // loop through the array of countries and insert them into the books table
  for (let i = 0; i < books.length; i++) {
    db.insertBooks(
      req.session.userId,
      books[i].author.name,
      books[i].title,
      books[i].id["_"],
      books[i].image_url,
      country
    )
      .then(data => {
        console.log("data from /insertAuthor : ", data);
      })
      .catch(e => {
        console.log("error in /insertAuthor : ", e);
      });
  }
  res.json({
    success: true
  });
});
// GET / getLatestData/:countryId
// find latest artists and authors from a specific country
app.get("/getLatestData/:countryId", (req, res) => {
  const { countryId } = req.params;
  console.log("country to be searched: ", countryId);
  (async () => {
    // const books = await db.getLatestBooks(countryId);
    const authors = await db.getLatestAuthors(countryId);
    const artists = await db.getLatestArtists(countryId);
    // console.log("books = ", books);
    console.log("authors = ", authors);
    console.log("authors = ", artists);
    res.json({
      // books,
      artists,
      authors
    });
  })();
});
// POST /searchArtist
// search for artists by name
app.post("/searchArtist", (req, res) => {
  console.log("artist to search for: ", req.body.artist);
  // dz.findArtists(req.body.artist)
  axios
    .get(
      "https://api.deezer.com/search/artist/?q=" +
        req.body.artist +
        '"&index=0&limit=5"'
    )
    .then(response => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(err => {
      console.log("error in searchArtist", err);
      res.json({ status: "not-found" });
    });
});
// POST /searchAlbum
// search for albums by name
app.post("/searchAlbum", (req, res) => {
  console.log("album to search for: ", req.body.album);
  axios
    .get(
      "https://api.deezer.com/search/album/?q=" +
        req.body.album +
        "&index=0&limit=5"
    )
    .then(response => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(err => {
      console.log("error in /searchAlbums", err);
      res.json({ status: "not-found" });
    });
});
// POST //addAlbums
// add selected albums to the table albums according to the country
app.post("/addAlbums", (req, res) => {
  console.log("albums to be inserted: ", req.body.albums);
  console.log("country to be added: ", req.body.country);
  const { albums, country } = req.body;
  for (let i = 0; i < albums.length; i++) {
    db.insertAlbum(
      req.session.userId,
      albums[i].artist.name,
      albums[i].title,
      albums[i].id,
      albums[i].cover_medium,
      albums[i].link,
      country
    )
      .then(data => {
        console.log("data from /addAlbum: ", data);
      })
      .catch(e => console.log("error in /addAlbums: ", e));
  }
  res.json({
    success: true
  });
});
// POST //addArtists
// add selected artists to the table artists according to the country
app.post("/addArtists", (req, res) => {
  console.log("artists to be inserted: ", req.body.artists);
  console.log("country to be added: ", req.body.country);
  const { artists, country } = req.body;
  for (let i = 0; i < artists.length; i++) {
    db.insertArtist(
      req.session.userId,
      artists[i].name,
      artists[i].id,
      artists[i].picture_medium,
      artists[i].link,
      country
    )
      .then(data => {
        console.log("data from /addAlbum: ", data);
      })
      .catch(e => console.log("error in /addArtists: ", e));
  }
  res.json({
    success: true
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
