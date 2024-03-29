import React from "react";
import axios from "../axios";
import CountrySearch from "./CountrySearch";

export default class SearchLiterature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      showAdd: false,
      uploaded: null,
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
    if (!this.state.bookOrAuthor) {
      this.setState({
        error: true,
        loading: false
      });
      return;
    }
    if (this.state.bookOrAuthor === "book") {
      this.setState({
        authors: null,
        showAdd: false,
        books: null,
        selectedItems: [],
        uploaded: null,
        notFound: false,
        error: false
      });

      // input is normalized in order to avoid accentuation
      axios
        .post("/searchBook", {
          book: this.state.bookOrAuthorToSearch
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        })
        .then(({ data }) => {
          console.log(data);
          if (data.status === "not-found") {
            this.setState({
              notFound: true,
              loading: false
            });
          } else {
            this.setState({
              books: data,
              loading: false
            });
          }
        })
        .catch(err => {
          console.log("error in /searchBook: ", err);
        });
    } else if (this.state.bookOrAuthor === "author") {
      this.setState({
        books: null,
        authors: null,
        showAdd: false,
        selectedItems: [],
        uploaded: null
      });

      // input is normalized in order to avoid accentuation
      axios
        .post("/searchAuthor", {
          author: this.state.bookOrAuthorToSearch
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        })
        .then(({ data }) => {
          console.log(data);
          if (data.status === "not-found") {
            this.setState({
              notFound: true,
              loading: false
            });
          } else {
            this.setState({
              authors: data,
              loading: false
            });
          }
        })
        .catch(err => {
          console.log("error in /searchBook: ", err);
        });
    }
  }

  handleSelect(item, type) {
    console.log("selected item is ", item);
    console.log("state = ", this.state[type]);
    let newState;
    if (type === "books") {
      newState = this.state[type].filter(el => el.id["_"] !== item.id["_"]);
    } else if (type === "authors") {
      newState = null;
    }
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
          <h1>LITERATURE SEARCH</h1>
          <input
            type="text"
            name="bookOrAuthorToSearch"
            placeholder="name to search"
            onChange={e => this.handleChange(e)}
          ></input>
          <br></br>
          <input
            type="radio"
            name="bookOrAuthor"
            value="book"
            onChange={e => this.handleChange(e)}
          ></input>
          <label>Book</label>
          <input
            type="radio"
            name="bookOrAuthor"
            value="author"
            onChange={e => this.handleChange(e)}
          ></input>
          <label>Author</label>
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

        {this.state.books && (
          <div className="albums-container">
            {this.state.books.map(book => (
              <div className="album" key={book.id["_"]}>
                <h2>{book.title}</h2>
                <img src={book.image_url} alt={book.title} />
                <button onClick={() => this.handleSelect(book, "books")}>
                  select this item
                </button>
              </div>
            ))}
          </div>
        )}

        {this.state.authors && (
          <div className="albums-container" key={this.state.authors.id}>
            <div className="album">
              <h2>{this.state.authors.name}</h2>
              <img
                src={this.state.authors.large_image_url}
                alt={this.state.authors.name}
              />
              <button
                onClick={() => this.handleSelect(this.state.authors, "authors")}
              >
                select this item
              </button>
              <a
                href={this.state.authors.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                GOODREADS Profile
              </a>
            </div>
          </div>
        )}

        {this.state.uploaded && (
          <div>
            <h1>Item uploaded to {this.state.uploaded}</h1>
          </div>
        )}

        {this.state.error && (
          <h1 className="wrong">You have to choose between Author or Book</h1>
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
                  books: null,
                  authors: null
                })
              }
              unselectHandler={(item, type) => {
                // const newState = this.state[type].concat(item);
                let newState;
                if (type === "books") {
                  newState = [item].concat(this.state[type]);
                } else if (type === "authors") {
                  newState = item;
                }
                const newSelected = this.state.selectedItems.filter(
                  el => el.id["_"] !== item.id["_"]
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
