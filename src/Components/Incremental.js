import React from "react";

export default class Incremental extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showList: true,
      list: []
    };
  }
  handleInputChange = e => {
    const search = e.target.value;
    this.setState({
      search: search,
      showList: true
    });
  };
  setValueHandler = item => {
    this.setState({
      search: item,
      showList: false
    });
  };
  makeResult = list => {
    const newList = list.filter(
      item => item.toLowerCase().indexOf(this.state.search.toLowerCase()) >= 0
    );
    if (newList.length)
      return newList.map(item => (
        <li onClick={() => this.setValueHandler(item)}>{item}</li>
      ));
    return <li>No results!</li>;
  };
  render() {
    return (
      <div>
        <h1>Incremental Search!</h1>
        <button onClick={this.switchListHandler}>Switch list!</button>
        <input
          value={this.state.search}
          onChange={this.handleInputChange}
          placeholder={`Enter the country name`}
        />
        {this.state.showList && <h3>Result</h3>}
        {this.state.search !== "" && this.state.showList ? (
          <ul>{this.makeResult(list)}</ul>
        ) : (
          this.state.showList && <p>Enter some text to see the result!</p>
        )}
      </div>
    );
  }
}
