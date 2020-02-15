import React, { Component } from "react";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  GeoJSON
} from "react-leaflet";
import geoJson from "../countries-land-10km.geo.json";
// import geoJson from "../custom.geo.json";
// import { useDispatch, useSelector } from "react-redux";
// import { HashRouter, Route } from "react-router-dom";
// import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// const { Map: LeafletMap, TileLayer, Marker, Popup } = ReactLeaflet;

export default class WorldMap extends React.Component {
  render() {
    return (
      <LeafletMap
        center={[20, 0]}
        zoom={1}
        maxZoom={10}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <Marker position={[50, 10]}>
          <Popup>Popup for any custom information.</Popup>
        </Marker>
        <GeoJSON
          data={geoJson}
          style={() => ({
            color: "#4a83ec",
            weight: 0.5,
            fillColor: "#1a1d62",
            fillOpacity: 1
          })}
        />
      </LeafletMap>
    );
  }
}
// export default function Welcome() {
//   const dispatch = useDispatch();
//   const map = useSelector(state => state && state.map);
//
//   // MOUNTING COMPONENT AND FECTCHING STATE
//   useEffect(() => {
//     dispatch(setMap());
//   });
//   return (
//     <HashRouter>
//       <div id="welcome">
//         <img src="/img/campodegelo-header" alt="header campodegelo"></img>
//         <div id="map"></div>
//       </div>
//     </HashRouter>
//   );
// }
