import React from "react";
import countries from "../iso3.json";
import axios from "../axios";

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
    this.props.unselectHandler(removeItem, this.props.type);
  }

  pushInformation(e) {
    console.log("Lets push it");
    console.log("selected country : ", this.state.country);
    console.log("type", this.props.type);
    if (this.props.type === "authors") {
      // push  into authors tables
      console.log("item to be inserted: ", this.props.selectedItems[0]);
      (async () => {
        const { data } = await axios.post("/addAuthor", {
          author: this.props.selectedItems[0],
          country: this.state.country
        });
        console.log("data from /addAuthor: ", data);
        if (data.success) {
          // clear the states
          this.props.closeModal(this.state.country);
        } else {
          this.setState({
            error: true
          });
        }
      })();
    } else if (this.props.type === "books") {
      // push into books tables
      console.log("item to be inserted: ", this.props.selectedItems);
      (async () => {
        const { data } = await axios.post("/addBooks", {
          books: this.props.selectedItems,
          country: this.state.country
        });
        console.log("data from /addBooks: ", data);
        if (data.success) {
          // clear the states
          this.props.closeModal(this.state.country);
        } else {
          this.setState({
            error: true
          });
        }
      })();
    }
  }

  render() {
    return (
      <div id="country">
        <div>
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
          <select
            value={this.state.country}
            onChange={e => this.handleChange(e)}
          >
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
        {this.state.error && (
          <h1>This item was already included in {this.state.country}</h1>
        )}
      </div>
    );
  }
}
