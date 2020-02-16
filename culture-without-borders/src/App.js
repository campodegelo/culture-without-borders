import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
// import WorldMap from "./Components/WorldMap";
import { HashRouter, Route } from "react-router-dom";
import Maps from "./Components/Map";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <header className="App-header">
          <h1>CULTURE WITHOUT BORDERS</h1>
        </header>
        <Maps />
      </div>
    </HashRouter>
  );
}

export default App;
