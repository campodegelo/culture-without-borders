import React, { useEffect } from "react";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  Popup,
  GeoJSON
} from "react-leaflet";
// import geoJson from "../countries-land-10km.geo.json";
// import geoJson from "../custom.geo.json";
import geoJson from "../countries.geo.json";

console.log("geoJson = ", geoJson);
// const borders = JSON.parse(geoJson);
// console.log("borders = ", borders);

export default class WorldMap extends React.Component {
  constructor(props) {
    super(props);
  }
  // const mapRef = createRef();

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    console.log("leafletMap : ", this.leafletMap);
    leafletMap.on("zoomend", () => {
      window.console.log("Current zoom level -> ", leafletMap.getZoom());
    });
    leafletMap.on("click", function(e) {
      console.log(e);
      // new .Popup()
      // .setLngLat(e.lngLat)
      // .setHTML(e.features[0].properties.name)
      // .addTo(leafletMap);
    });
  }

  handleClick(e) {
    console.log("e.target", e.target);
    e.target.setStyle({ fillColor: "yellow" });
    // const map = mapRef.current;
    // console.log("map = ", map);
    // if (map != null) {
    // map.leafletElement.locate();
    // }
  }

  render() {
    return (
      <LeafletMap
        ref={m => {
          this.leafletMap = m;
        }}
        center={[0, 0]}
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
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
          onClick={e => this.handleClick(e)}
          // onMouseOut={e => e.target.setStyle({ fillColor: "#1a1d62" })}
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
