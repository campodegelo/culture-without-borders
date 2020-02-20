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
      // console.log(
      //   "comparison, data.albums[data.albums.length - 1]: ",
      //   data.albums[data.albums.length - 1]
      // );
      // console.log("id: ", data.albums[data.albums.length - 1].id);
      // console.log("lowestId: ", data.albums[0].lowestId);
      // console.log(
      //   "data.albums[data.albums.length - 1].id > data.albums[0].lowestId : ",
      //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      // );
      this.setState({
        albums: data.albums,
        artists: data.artists,
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

  render() {
    return (
      <div className="albums-screen">
        <h1>Music Page</h1>
        <img
          src={`/flags-big-iso3/${this.props.match.params.id}.png`}
          alt={this.props.match.params.id}
          className="big-flag"
        />

        <Link to={"/searchMusic"}>
          Want to add more albums or artists? Click here!
        </Link>

        <div className="previous">
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
                {this.state.showMoreAlbums && <button>show more albums</button>}
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
                  <button>show more artists</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
