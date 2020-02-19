import React from "react";
import axios from "../axios";
import CountrySearch from "./CountrySearch";

export default class SearchMusic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: null,
      albums: null
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    if (this.state.albumOrArtist === "album") {
      this.setState({
        artists: null,
        showAdd: false,
        selectedItems: [],
        uploaded: null
      });

      // input is normalized in order to avoid accentuation
      axios
        .post("/searchAlbum", {
          album: this.state.albumOrArtistToSearch
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        })
        .then(({ data }) => {
          console.log("data from searchalbum: ", data.data);
          this.setState({
            albums: data.data
          });
        })
        .catch(err => {
          console.log("error in /searchAlbum: ", err);
        });
    } else if (this.state.albumOrArtist === "artist") {
      this.setState({
        albums: null,
        showAdd: false,
        selectedItems: [],
        uploaded: null
      });

      // input is normalized in order to avoid accentuation
      axios
        .post("/searchArtist", {
          artist: this.state.albumOrArtistToSearch
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        })
        .then(({ data }) => {
          console.log("data from searchartist: ", data.data);
          this.setState({
            artists: data.data
          });
        })
        .catch(err => {
          console.log("error in /searchalbum: ", err);
        });
    }
  }

  handleSelect(item, type) {
    console.log("selected item is ", item);
    console.log("state = ", this.state[type]);
    let newState;
    // if (type === "albums") {
    newState = this.state[type].filter(el => el.id !== item.id);
    // } else if (type === "artists") {
    // newState = null;
    // }
    console.log("newState: ", newState);
    this.setState({
      selectedItems: this.state.selectedItems.concat(item),
      showAdd: true,
      type: type,
      [type]: newState
    });
  }

  render() {
    return (
      <div>
        <input
          type="text"
          name="albumOrArtistToSearch"
          placeholder="search for an album"
          onChange={e => this.handleChange(e)}
        ></input>
        <br></br>
        <input
          type="radio"
          name="albumOrArtist"
          value="album"
          onChange={e => this.handleChange(e)}
        ></input>
        <label>Album</label>
        <input
          type="radio"
          name="albumOrArtist"
          value="artist"
          onChange={e => this.handleChange(e)}
        ></input>
        <label>Artist</label>
        <br></br>
        <button onClick={() => this.handleSubmit()}>search</button>

        {this.state.albums && (
          <div className="albums-container">
            {this.state.albums.map(album => (
              <div className="album" key={album.id}>
                <h2>{album.title}</h2>
                <img src={album.cover_medium} alt={album.title} />
                <button onClick={() => this.handleSelect(album, "albums")}>
                  select this item
                </button>
                <a href={album.link} target="_blank" rel="noopener noreferrer">
                  Deezer Profile
                </a>
              </div>
            ))}
          </div>
        )}

        {this.state.artists && (
          <div className="artists-container">
            {this.state.artists.map(artist => (
              <div className="single-artist" key={artist.id}>
                <h2>{artist.name}</h2>
                <img src={artist.picture_medium} alt={artist.name} />
                <button onClick={() => this.handleSelect(artist, "artists")}>
                  select this item
                </button>
                <a href={artist.link} target="_blank" rel="noopener noreferrer">
                  Deezer Profile
                </a>
              </div>
            ))}
          </div>
        )}

        {this.state.uploaded && (
          <div>
            <h1>Item uploaded to {this.state.uploaded}</h1>
          </div>
        )}

        {this.state.showAdd && (
          <div>
            <CountrySearch
              state={this.state}
              selectedItems={this.state.selectedItems}
              type={this.state.type}
              closeModal={e =>
                this.setState({
                  showAdd: false,
                  uploaded: e,
                  albums: null,
                  artists: null
                })
              }
              unselectHandler={(item, type) => {
                // const newState = this.state[type].concat(item);
                let newState;
                // if (type === "albums") {
                newState = [item].concat(this.state[type]);
                // } else if (type === "artists") {
                // newState = item;
                // }
                const newSelected = this.state.selectedItems.filter(
                  el => el.id !== item.id
                );
                this.setState({
                  [type]: newState,
                  selectedItems: newSelected,
                  showAdd: newSelected.length !== 0
                });
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
