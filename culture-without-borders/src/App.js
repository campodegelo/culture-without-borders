import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
// import WorldMap from "./Components/WorldMap";
import { BrowserRouter, HashRouter, Link, Route } from "react-router-dom";
import Maps from "./Components/Map";
import Books from "./Components/Books";
import SearchLiterature from "./Components/SearchLiterature";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>CULTURE WITHOUT BORDERS</h1>
        </header>
        {/* <Maps /> */}
        <Route exact path="/" component={Maps} />
        <Route path="/books/:id" component={Books} />
        <Route exact path="/searchLiterature" component={SearchLiterature} />
      </div>
    </BrowserRouter>
  );
}

export default App;
