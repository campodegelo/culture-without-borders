import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("this.props.match.params.id: ", this.props.match.params.id);
    // fetch artists and albums information from the database
    (async () => {
      const { data } = await axios.get(
        "/getArtistsAndAlbums/" + this.props.match.params.id
      );
      console.log("data from /getArtistsAndAlbums: ", data);
      //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      // );
      this.setState({
        albums: data.albums,
        artists: data.artists,
        lastIdAlbum:
          data.albums[data.albums.length - 1] &&
          data.albums[data.albums.length - 1].id,
        lastIdArtist:
          data.artists[data.artists.length - 1] &&
          data.artists[data.artists.length - 1].id,
        // lastIdOnScreenalbum: data.albums[data.albums.length - 1].id,
        // lowestIdalbums: data.albums[0].lowestId,
        // lowestIdartists: data.artists[0].lowestId,
        // lastIdOnScreenartist: data.artists[data.artists.length - 1].id,
        showMoreAlbums:
          data.albums[data.albums.length - 1] &&
          data.albums[data.albums.length - 1].id > data.albums[0].lowestId,
        showMoreArtists:
          data.artists[data.artists.length - 1] &&
          data.artists[data.artists.length - 1].id > data.artists[0].lowestId
      });
    })();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.match.params.id !== prevProps.match.params.id) {
      (async () => {
        const { data } = await axios.get(
          "/getArtistsAndAlbums/" + this.props.match.params.id
        );
        console.log("data from /getArtistsAndAlbums: ", data);
        //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
        // );
        this.setState({
          albums: data.albums,
          artists: data.artists,
          lastIdAlbum:
            data.albums[data.albums.length - 1] &&
            data.albums[data.albums.length - 1].id,
          lastIdArtist:
            data.artists[data.artists.length - 1] &&
            data.artists[data.artists.length - 1].id,
          // lastIdOnScreenalbum: data.albums[data.albums.length - 1].id,
          // lowestIdalbums: data.albums[0].lowestId,
          // lowestIdartists: data.artists[0].lowestId,
          // lastIdOnScreenartist: data.artists[data.artists.length - 1].id,
          showMoreAlbums:
            data.albums[data.albums.length - 1] &&
            data.albums[data.albums.length - 1].id > data.albums[0].lowestId,
          showMoreArtists:
            data.artists[data.artists.length - 1] &&
            data.artists[data.artists.length - 1].id > data.artists[0].lowestId
        });
      })();
    }
  }

  showMoreAlbums() {
    (async () => {
      const { data } = await axios.post("/moreAlbums", {
        country: this.props.match.params.id,
        lastId: this.state.lastIdAlbum
      });
      console.log("data from /getArtistsAndAlbums: ", data);
      //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      // );
      this.setState({
        albums: this.state.albums.concat(data.albums),
        lastIdAlbum:
          data.albums[data.albums.length - 1] &&
          data.albums[data.albums.length - 1].id,
        showMoreAlbums:
          data.albums[data.albums.length - 1] &&
          data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      });
    })();
  }

  showMoreArtists() {
    (async () => {
      const { data } = await axios.post("/moreArtists", {
        country: this.props.match.params.id,
        lastId: this.state.lastIdArtist
      });
      console.log("data from /getArtistsAndAlbums: ", data);
      //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      // );
      this.setState({
        artists: this.state.artists.concat(data.artists),
        lastIdArtist:
          data.artists[data.artists.length - 1] &&
          data.artists[data.artists.length - 1].id,
        showMoreArtists:
          data.artists[data.artists.length - 1] &&
          data.artists[data.artists.length - 1].id > data.artists[0].lowestId
      });
    })();
  }

  render() {
    return (
      <div className="albums-screen">
        <h1>Music Page</h1>
        {/* <img
          src={`/flags-big-iso3/${this.props.match.params.id}.png`}
          alt={this.props.match.params.id}
          className="big-flag"
        /> */}

        <Link class="other-screen" to={`/books/${this.props.match.params.id}`}>
          <img src="/img/books.png" alt="books" />
        </Link>

        <Link to={"/searchMusic"}>
          Want to add more albums or artists? Click here!
        </Link>

        <div
          className="previous"
          style={{
            backgroundImage: `url(/flags-big-iso3/${this.props.match.params.id.toLowerCase()}.png)`
          }}
        >
          <div className="big-container albums">
            <h2>ALBUMS</h2>
            {this.state.albums && (
              <div className="icons-big">
                {this.state.albums.map(album => (
                  <div className="big-item" key={album.album_id}>
                    <div className="overlay-big">
                      <h3>{album.album_name}</h3>
                    </div>
                    <img src={album.image} alt={album.album_name}></img>
                  </div>
                ))}
                {this.state.showMoreAlbums && (
                  <button onClick={() => this.showMoreAlbums()}>
                    show more albums
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="big-container artists">
            <h2>ARTISTS</h2>
            {this.state.artists && (
              <div className="icons-big">
                {this.state.artists.map(artist => (
                  <div className="big-item" key={artist.id}>
                    <div className="overlay-big">
                      <h3>{artist.artist_name}</h3>
                    </div>
                    <img src={artist.image} alt={artist.artist_name}></img>
                  </div>
                ))}
                {this.state.showMoreArtists && (
                  <button onClick={() => this.showMoreArtists()}>
                    show more artists
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
