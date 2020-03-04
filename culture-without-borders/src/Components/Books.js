import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("this.props.match.params.id: ", this.props.match.params.id);
    // fetch artists and books information from the database
    (async () => {
      const { data } = await axios.get(
        "/getBooksAndAuthors/" + this.props.match.params.id
      );
      console.log("data from /getBooksAndAuthors: ", data);
      this.setState({
        books: data.books,
        authors: data.authors,
        lastIdBook:
          data.books[data.books.length - 1] &&
          data.books[data.books.length - 1].id,
        lastIdAuthor:
          data.authors[data.authors.length - 1] &&
          data.authors[data.authors.length - 1].id,
        // lastIdOnScreenBook: data.books[data.books.length - 1].id,
        // lowestIdBooks: data.books[0].lowestId,
        // lowestIdAuthors: data.authors[0].lowestId,
        // lastIdOnScreenAuthor: data.authors[data.authors.length - 1].id,
        showMoreBooks:
          data.books[data.books.length - 1] &&
          data.books[data.books.length - 1].id > data.books[0].lowestId,
        showMoreAuthors:
          data.authors[data.authors.length - 1] &&
          data.authors[data.authors.length - 1].id > data.authors[0].lowestId
      });
    })();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.match.params.id !== prevProps.match.params.id) {
      // fetch artists and books information from the database
      (async () => {
        const { data } = await axios.get(
          "/getBooksAndAuthors/" + this.props.match.params.id
        );
        console.log("data from /getBooksAndAuthors: ", data);
        this.setState({
          books: data.books,
          authors: data.authors,
          lastIdBook:
            data.books[data.books.length - 1] &&
            data.books[data.books.length - 1].id,
          lastIdAuthor:
            data.authors[data.authors.length - 1] &&
            data.authors[data.authors.length - 1].id,
          // lastIdOnScreenBook: data.books[data.books.length - 1].id,
          // lowestIdBooks: data.books[0].lowestId,
          // lowestIdAuthors: data.authors[0].lowestId,
          // lastIdOnScreenAuthor: data.authors[data.authors.length - 1].id,
          showMoreBooks:
            data.books[data.books.length - 1] &&
            data.books[data.books.length - 1].id > data.books[0].lowestId,
          showMoreAuthors:
            data.authors[data.authors.length - 1] &&
            data.authors[data.authors.length - 1].id > data.authors[0].lowestId
        });
      })();
    }
  }

  showMoreBooks() {
    (async () => {
      const { data } = await axios.post("/moreBooks", {
        country: this.props.match.params.id,
        lastId: this.state.lastIdBook
      });
      console.log("data from /getArtistsAndAlbums: ", data);
      //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      // );
      this.setState({
        books: this.state.books.concat(data.books),
        lastIdBook:
          data.books[data.books.length - 1] &&
          data.books[data.books.length - 1].id,
        showMoreBooks:
          data.books[data.books.length - 1] &&
          data.books[data.books.length - 1].id > data.books[0].lowestId
      });
    })();
  }

  showMoreAuthors() {
    (async () => {
      const { data } = await axios.post("/moreAuthors", {
        country: this.props.match.params.id,
        lastId: this.state.lastIdAuthor
      });
      console.log("data from /getArtistsAndAlbums: ", data);
      //   data.albums[data.albums.length - 1].id > data.albums[0].lowestId
      // );
      this.setState({
        books: this.state.authors.concat(data.authors),
        lastIdAuthor:
          data.authors[data.authors.length - 1] &&
          data.authors[data.authors.length - 1].id,
        showMoreAuthors:
          data.authors[data.authors.length - 1] &&
          data.authors[data.authors.length - 1].id > data.authors[0].lowestId
      });
    })();
  }

  render() {
    return (
      <div className="albums-screen">
        <h1>Book Page</h1>
        {/* <img
          src={`/flags-big-iso3/${this.props.match.params.id}.png`}
          alt={this.props.match.params.id}
          className="big-flag"
        /> */}

        <Link class="other-screen" to={`/music/${this.props.match.params.id}`}>
          <img src="/img/music.png" alt="books" />
        </Link>

        <Link to={"/searchLiterature"}>
          Want to add more books or authors? Click here!
        </Link>

        <div
          className="previous"
          style={{
            backgroundImage: `url(/flags-big-iso3/${this.props.match.params.id}.png)`
          }}
        >
          <div className="big-container">
            <h2>BOOKS</h2>
            {this.state.books && (
              <div className="icons-big">
                {this.state.books.map(book => (
                  <div className="big-item" key={book.book_id}>
                    <div className="overlay-big">
                      <h3>{book.book_name}</h3>
                    </div>
                    <img
                      className="book-size"
                      src={book.image}
                      alt={book.book_name}
                    ></img>
                  </div>
                ))}
                {this.state.showMoreBooks && (
                  <button onClick={() => this.showMoreBooks()}>
                    show more books
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="big-container">
            <h2>AUTHORS</h2>
            {this.state.authors && (
              <div className="icons-big">
                {this.state.authors.map(author => (
                  <div className="big-item" key={author.id}>
                    <div className="overlay-big">
                      <h3>{author.author}</h3>
                    </div>
                    <img
                      className="author-size"
                      src={author.image}
                      alt={author.author}
                    ></img>
                  </div>
                ))}
                {this.state.showMoreAuthors && (
                  <button onClick={() => this.showMoreAuthors()}>
                    show more authors
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
