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
    })();
  }

  render() {
    return (
      <div className="books-screen">
        <h1>Book Page</h1>
        <img
          src={`/flags-big-iso3/${this.props.match.params.id}.png`}
          alt={this.props.match.params.id}
        />
        <Link to={"/searchLiterature"}>
          Want to add more books or authors? Click here!
        </Link>
      </div>
    );
  }
}
