import React from "react";
import axios from "../axios";

export default class CountryPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      id: this.props.countryISO3,
      url: "/flags-big-iso3/" + this.props.countryISO3 + ".png"
    };
  }

  componentDidMount() {
    //
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
      </div>
    );
  }
}
