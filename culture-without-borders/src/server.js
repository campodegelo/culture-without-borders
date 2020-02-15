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
// GET - /country/:code
// Get the information about a country specified by its ISO country code
app.get("/country/:code", (req, res) => {
  // retrieve information from the database
});
/***********************************************************************/

const goodreads = require("goodreads-api-node");

const myCredentials = {
  key: secrets.MY_GOODREADS_KEY,
  secret: secrets.MY_GOODREADS_SECRET
};

const gr = goodreads(myCredentials);

// returns all books by an author given the authorID
gr.getBooksByAuthor("175417").then(console.log);

/***********************************************************************/

server.listen(process.env.PORT || 8080, () => {
  console.log("Listening...");
});
