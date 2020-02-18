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
// const SpotifyWebApi = require("spotify-web-api-node");
// const Deezer = require("deezer-node-api");
// const dz = new Deezer();
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
        // res.json({
        // success: false
        // });
      });
  }
  res.json({
    success: true
  });
  // const { data } = books.map(book => {
  //   db.insertBook("eisfeld", book.author.name, book.title, book.image_url);
  // });
});
// GET / popUpLiterature/:countryId
// find latest books and authors for a specific country
app.get("/popUpLiterature/:countryId", (req, res) => {
  const { countryId } = req.params;
  console.log("country to be searched: ", countryId);
  (async () => {
    const books = await db.getLatestBooks(countryId);
    const authors = await db.getLatestAuthors(countryId);
    console.log("books = ", books);
    console.log("authors = ", authors);
    res.json({
      books,
      authors
    });
  })();
});
// POST /searchArtist
// search for artists by name
// credentials are optional
// const spotifyApi = new SpotifyWebApi({
//   clientId: "72d55b4b25d248079d33d88f055ea875",
//   clientSecret: "0a83661a83974bd5ae38da5a7eb65dc4",
//   redirectUri: "http://www.example.com/callback"
// });

// spotifyApi.setAccessToken("<your_access_token>");
app.post("/searchArtist", (req, res) => {
  console.log("artist to search for: ", req.body.artist);
  // dz.findArtists(req.body.artist)
  axios
    .get(`https://api.deezer.com/search/artist/?q=${req.body.artist}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.log("error", err);
    });
  // .then(result => {/
  // console.log(result);
  // })
  // .catch(e => console.log(e));

  // spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
  //   function(data) {
  //     console.log("Artist albums", data.body);
  //   },
  //   function(err) {
  //     console.error(err);
  //   }
  // );
  // axios
  //   .get("https://elegant-croissant.glitch.me/spotify", {
  //     data: {
  //       query: req.body.artist,
  //       type: "artist"
  //     }
  //   })
  //   .then(data => {
  //     console.log("data from /searchArtist ", data);
  //   })
  //   .catch(e => console.log("error in /searchArtist", e));
});
// POST /searchAlbum
// search for albums by name
app.post("/searchAlbums", (req, res) => {
  console.log("album to search for: ", req.body.album);
  axios
    .get(
      "https://api.deezer.com/search/album/?q=" +
        req.body.album +
        "&index=0&limit=2"
    )
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.log("error", err);
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
