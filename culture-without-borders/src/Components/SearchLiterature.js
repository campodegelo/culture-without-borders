import React from "react";
import axios from "../axios";

export default class SearchLiterature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    if (this.state.bookOrAuthor === "book") {
      this.setState({
        authors: null
      });
      axios
        .post("/searchBook", { book: this.state.bookOrAuthorToSearch })
        .then(({ data }) => {
          console.log(data);
          this.setState({
            books: data
          });
          // if (!data.success) {
          //   setError(true);
          // } else {
          //   location.replace("/");
          // }
        })
        .catch(err => {
          console.log("error in /searchBook: ", err);
          // setError(true);
        });
    } else if (this.state.bookOrAuthor === "author") {
      this.setState({
        books: null
      });
      axios
        .post("/searchAuthor", { author: this.state.bookOrAuthorToSearch })
        .then(({ data }) => {
          console.log(data);
          this.setState({
            authors: data
          });
          // if (!data.success) {
          //   setError(true);
          // } else {
          //   location.replace("/");
          // }
        })
        .catch(err => {
          console.log("error in /searchBook: ", err);
          // setError(true);
        });
    }
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
            <a
              href={this.state.authors.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              GOODREADS Profile
            </a>
          </div>
        )}
      </div>
    );
  }
}
