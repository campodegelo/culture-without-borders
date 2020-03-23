import React from "react";
import axios from "../axios";
import CountrySearch from "./CountrySearch";

export default class SearchMusic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: null,
      albums: null,
      loading: false,
      notFound: false
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    this.setState({ loading: true });
    console.log("this.state.albumOrArtist: ", this.state.albumOrArtist);
    if (!this.state.albumOrArtist) {
      this.setState({
        error: true,
        loading: false
      });
      return;
    }
    if (this.state.albumOrArtist === "album") {
      this.setState({
        artists: null,
        albums: null,
        showAdd: false,
        selectedItems: [],
        uploaded: null,
        error: false
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
          if (data.status === "not-found") {
            this.setState({
              notFound: true,
              loading: false
            });
          } else {
            this.setState({
              albums: data.data,
              next: data.next,
              loading: false
            });
          }
        })
        .catch(err => {
          console.log("error in /searchAlbum: ", err);
        });
    } else if (this.state.albumOrArtist === "artist") {
      console.log("searching for artists");
      this.setState({
        albums: null,
        artists: null,
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
          if (data.status === "not-found") {
            this.setState({
              notFound: true,
              loading: false
            });
          } else {
            this.setState({
              artists: data.data,
              loading: false
            });
          }
        })
        .catch(err => {
          console.log("error in /searchalbum: ", err);
        });
    }
  }

  showMore() {
    (async () => {
      const { data } = await axios.post("/showMore", {
        next: this.state.next
      });
      // axios.get(this.state.next);
      console.log("data from showMore : ", data);
      this.setState({
        ...this.state,
        next: data.next,
        albums: this.state.albums.concat(data.data)
      });
    })();
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
      <div className="search-container">
        <div className="regular-form">
          <h1>MUSIC SEARCH</h1>
          <input
            type="text"
            name="albumOrArtistToSearch"
            placeholder="name to search"
            onChange={e => this.handleChange(e)}
          ></input>
          <br></br>
          <div>
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
          </div>
          <br></br>
          <button onClick={() => this.handleSubmit()}>search</button>
        </div>

        {this.state.loading && (
          <img
            className="loading"
            src="/img/loading.gif"
            alt="loading"
            key="loading"
          />
        )}

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
            {this.state.next && (
              <button onClick={() => this.showMore()}>show more</button>
            )}
          </div>
        )}

        {this.state.artists && (
          <div className="albums-container">
            {this.state.artists.map(artist => (
              <div className="album" key={artist.id}>
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

        {this.state.notFound && (
          <div>
            <h2>Item not Found</h2>
            <img
              className="not-found"
              src="/img/404.gif"
              alt="not found"
              key="notfound"
            />
          </div>
        )}

        {this.state.uploaded && (
          <div>
            <h1>Item uploaded to {this.state.uploaded}</h1>
          </div>
        )}

        {this.state.error && (
          <h1 className="wrong">You have to choose between Album and Artist</h1>
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
