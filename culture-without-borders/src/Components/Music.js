import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default class Music extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div className="music-screen">
        <h1>Music Page</h1>

        <Link to={"/searchMusic"}>
          Want to add more albums or artists? Click here!
        </Link>
      </div>
    );
  }
}
