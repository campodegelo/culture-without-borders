import React from "react";
import countries from "../iso3.json";

export default class CountrySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "AFG",
      selectedItems: props.selectedItems
    };
  }

  handleChange(e) {
    this.setState({ country: e.target.value });
  }

  handleUnSelect(removeItem) {
    console.log("selected items: ", this.props.selectedItems);
    console.log("item has been unselected: ", removeItem);
    // const newState = this.state.selectedItems.filter(
    // el => el.id["_"] !== removeItem.id["_"]
    // );
    // this.setState({
    // selectedItems: newState
    // });
    this.props.unselectHandler(removeItem, this.props.type);
    // this.props.selectedItems.filter(item => {
    //   if (item.id["_"] != removeItem.id["_"]) {
    //     return item;
    //   }
    // });
  }

  pushInformation(e) {
    console.log("Lets push it");
    console.log("selected country : ", this.state.country);
    console.log("type", this.props.type);
  }

  render() {
    return (
      <div id="country">
        {this.props.selectedItems && (
          <div id="selectedItems">
            {this.props.selectedItems.map(item => (
              <div key={item.image_url}>
                <img src={item.image_url} alt={item.title} />
                <button onClick={() => this.handleUnSelect(item)}>
                  unselect item
                </button>
              </div>
            ))}
          </div>
        )}
        <h2>Choose the country where it belongs to</h2>
        <select value={this.state.country} onChange={e => this.handleChange(e)}>
          {countries.map(country => (
            <option
              key={country.name}
              name="country"
              value={country["alpha-3"]}
            >
              {country.name}
            </option>
          ))}
        </select>
        <button onClick={e => this.pushInformation(e)}>add item</button>
      </div>
    );
  }
}
