import React, { useEffect } from "react";
import { BrowserRouter, HashRouter, Link, Route } from "react-router-dom";
import axios from "./axios";
import Maps from "./Components/Map";
import Books from "./Components/Books";
import SearchLiterature from "./Components/SearchLiterature";
import Registration from "./Components/Registration";
import Login from "./Components/Login";
import Music from "./Components/Music";
import SearchMusic from "./Components/SearchMusic";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    axios.get("/user").then(({ data }) => {
      if (data.success !== false) {
        this.setState({ loggedUser: data });
      }
    });
  }
  render() {
    return (
      <HashRouter>
        <div className="App">
          <header className="App-header">
            <h1>CULTURE WITHOUT BORDERS</h1>
            {!this.state.loggedUser && (
              <div className="menu-user">
                <Link to="/register">Sign up</Link>
                <Link to="/login">Sign in</Link>
              </div>
            )}
            {this.state.loggedUser && (
              <div className="menu-user">
                <a href="/logout">logout</a>
              </div>
            )}
          </header>
          {/* <Maps /> */}
          <Route exact path="/" component={Maps} />
          <Route path="/books/:id" component={Books} />
          <Route exact path="/searchLiterature" component={SearchLiterature} />
          <Route path="/music/:id" component={Music} />
          <Route exact path="/searchMusic" component={SearchMusic} />
          <Route exact path="/register" component={Registration} />
          <Route exact path="/login" component={Login} />
        </div>
      </HashRouter>
    );
  }
}
