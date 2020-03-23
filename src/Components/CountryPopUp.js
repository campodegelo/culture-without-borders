import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
// import Books from "./Books";

export default class CountryPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name.toUpperCase(),
      id: this.props.countryISO3,
      url: "/flags-big-iso3/" + this.props.countryISO3.toLowerCase() + ".png",
      books: null,
      authors: null
    };
  }

  componentDidMount() {
    (async () => {
      const { data } = await axios.get("/getLatestData/" + this.state.id);
      console.log("data from popup ", data);
      this.setState({
        artists: data.artists,
        authors: data.authors
      });
    })();
  }

  render() {
    return (
      <div className="country-popup">
        <h1>{this.state.name}</h1>
        <img
          src={this.state.url}
          key={this.state.id}
          alt={this.state.name}
          id="flag"
        ></img>
        <p onClick={this.props.closeModal}>X</p>

        <div id="previous-info">
          <div className="small-container">
            {this.state.artists && (
              <div className="icons-pop">
                {this.state.artists.map(artist => (
                  <div className="small-item" key={artist.artist_id}>
                    <div className="overlay">
                      <h2>{artist.artist_name}</h2>
                    </div>
                    <img src={artist.image} alt={artist.artist_name}></img>
                  </div>
                ))}
                <h1>LATEST UPLOADED ARTISTS</h1>
              </div>
            )}
          </div>

          <div className="small-container">
            {this.state.authors && (
              <div className="icons-pop">
                {this.state.authors.map(author => (
                  <div className="small-item" key={author.id}>
                    <div className="overlay-author">
                      <h2>{author.author}</h2>
                    </div>
                    <img
                      className="author-image"
                      src={author.image}
                      alt={author.author}
                    ></img>
                  </div>
                ))}
                <h1>LATEST UPLOADED AUTHORS</h1>
              </div>
            )}
          </div>
        </div>

        <div className="more-content">
          <Link to={`/books/${this.state.id}`}>
            <img src="/img/books.png" alt="books" />
            <h3>
              more literature from <br></br>
              {this.state.name}
            </h3>
          </Link>
          <Link to={`/music/${this.state.id}`}>
            <img src="/img/music.png" alt="music" />
            <h3>
              more music from <br></br>
              {this.state.name}
            </h3>
          </Link>
        </div>
      </div>
    );
  }
}
