import React from "react";
import axios from "../axios";
import CountrySearch from "./CountrySearch";

export default class SearchLiterature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      showAdd: false
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    if (this.state.bookOrAuthor === "book") {
      this.setState({
        authors: null,
        showAdd: false,
        selectedItems: []
      });
      axios
        .post("/searchBook", { book: this.state.bookOrAuthorToSearch })
        .then(({ data }) => {
          console.log(data);
          this.setState({
            books: data
          });
        })
        .catch(err => {
          console.log("error in /searchBook: ", err);
        });
    } else if (this.state.bookOrAuthor === "author") {
      this.setState({
        books: null,
        showAdd: false,
        selectedItems: []
      });
      axios
        .post("/searchAuthor", { author: this.state.bookOrAuthorToSearch })
        .then(({ data }) => {
          console.log(data);
          this.setState({
            authors: data
          });
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
      newState = {};
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
      <div>
        <input
          type="text"
          name="bookOrAuthorToSearch"
          placeholder="search for a book"
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

        {this.state.books && (
          <div className="books-container">
            {this.state.books.map(book => (
              <div className="book" key={book.id["_"]}>
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
          <div className="author-container" key={this.state.authors.id}>
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
        )}

        {this.state.showAdd && (
          <div>
            <CountrySearch
              state={this.state}
              selectedItems={this.state.selectedItems}
              type={this.state.type}
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
