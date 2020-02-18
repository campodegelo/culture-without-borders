import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";
// import Books from "./Books";

export default class CountryPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      id: this.props.countryISO3,
      url: "/flags-big-iso3/" + this.props.countryISO3 + ".png",
      books: null,
      authors: null
    };
  }

  componentDidMount() {
    (async () => {
      const { data } = await axios.get("/popUpLiterature/" + this.state.id);
      console.log("data from popup ", data);
      this.setState({
        books: data.books,
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
        ></img>
        <p onClick={this.props.closeModal}>X</p>

        <div id="previous-info">
          <div className="small-container">
            {this.state.books && (
              <div className="icons-pop">
                {this.state.books.map(book => (
                  <div className="small-item" key={book.book_id}>
                    <div className="overlay">
                      <h2>{book.book_name}</h2>
                    </div>
                    <img src={book.image} alt={book.book_name}></img>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="small-container">
            {this.state.authors && (
              <div className="icons-pop">
                {this.state.authors.map(author => (
                  <div className="small-item" key={author.id}>
                    <div className="overlay">
                      <h2>{author.author}</h2>
                    </div>
                    <img src={author.image} alt={author.author}></img>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link to={`/books/${this.state.id}`}>
          Literature from {this.state.name}
        </Link>
      </div>
    );
  }
}
