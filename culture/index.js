// var mymap = L.map("mapid").setView([51.505, -0.09], 13);
//
// L.tileLayer(
//   "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
//   {
//     attribution:
//       'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: "mapbox/streets-v11",
//     accessToken:
//       "pk.eyJ1IjoiY2FtcG9kZWdlbG8iLCJhIjoiY2s2Z2FyNm5vMGtsaTNlbWxiNjNlM2RwMSJ9.iyUNkPmxcXadLwyL9jHc-w"
//   }
// ).addTo(mymap);
//
// function onMapClick(e) {
//   console.log("You clicked the map at " + e.latlng);
// }
//
// mymap.on("click", onMapClick);

const secrets = require("./secrets");
const goodreads = require("goodreads-api-node");

const myCredentials = {
  key: secrets.MY_GOODREADS_KEY,
  secret: secrets.MY_GOODREADS_SECRET
};

const gr = goodreads(myCredentials);

// returns all books by an author given the authorID
gr.getBooksByAuthor("41108").then(console.log);
