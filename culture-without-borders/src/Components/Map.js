import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import axios from "../axios";
// import geoJson from "../countries.geo.json";
import geoJson from "../custom.geo.json";
import CountryPopUp from "./CountryPopUp";
// import geoJson from "../countries-land-10km.geo.json";

// mapboxgl.accessToken = "MAPBOX_ACCESS_TOKEN";
mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FtcG9kZWdlbG8iLCJhIjoiY2s2b3lpdDJwMDkzaTNrcW8weno3ZzljciJ9.ggdQUJLnLnWQ92IjWlFK5g";
// mapboxgl.accessToken =
//   "pk.eyJ1IjoiY2FtcG9kZWdlbG8iLCJhIjoiY2s2Z2FyNm5vMGtsaTNlbWxiNjNlM2RwMSJ9.iyUNkPmxcXadLwyL9jHc-w";
export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 0,
      lat: 0,
      zoom: 1
    };
  }

  componentDidMount() {
    let hoveredCountry = null;
    let instance = this;

    // axios.get("/getMap").then(({ data }) => {
    //   console.log("data from /getMap : ", data);
    // });

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: "mapbox://styles/mapbox/dark-v10",
      // style: "mapbox://styles/campodegelo/ck6peiqju12nc1is9h04l2lg3",
      // style: "mapbox://styles/campodegelo/ck6pf5nj012wt1io6pt1i2cb9",
      style: "mapbox://styles/campodegelo/ck6tgsp387nkz1imw0h5okcha",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    // LOAD COORDINATES AND BORDER INFO FROM getJSON FILE
    map.on("load", function() {
      map.addSource("countries", {
        type: "geojson",
        data: geoJson,
        generateId: true
      });

      map.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries",
        layout: {},
        paint: {
          // "fill-color": "#1a1d62",
          "fill-color": "#D14545",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.01
          ]
        }
      });

      map.addLayer({
        id: "borders-layer",
        type: "line",
        source: "countries",
        layout: {},
        paint: {
          // "line-color": "#48896D",
          "line-color": "black",
          "line-width": 0.1
        }
      });
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Event Handlers on the map
    map.on("click", "countries-layer", function(e) {
      // console.log("country name = ", e.features[0].properties.name);
      // console.log("ISO 3 = ", e.features[0].properties.adm0_a3);

      instance.setState({
        name: e.features[0].properties.name,
        countryISO3: e.features[0].properties.adm0_a3,
        countryWasClicked: true
      });
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mousemove", "countries-layer", function(e) {
      map.getCanvas().style.cursor = "pointer";
      // console.log(e.features);
      if (hoveredCountry) {
        map.removeFeatureState({ source: "countries", id: hoveredCountry });
      }
      hoveredCountry = e.features[0].id;
      map.setFeatureState(
        { source: "countries", id: hoveredCountry },
        { hover: true }
      );
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "countries-layer", function(e) {
      map.getCanvas().style.cursor = "";
      map.setFeatureState(
        { source: "countries", id: hoveredCountry },
        { hover: false }
      );
      hoveredCountry = null;
    });

    // updating coordinates
    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    return (
      <div>
        {/* <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{" "}
            {this.state.zoom}
          </div>
        </div> */}
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
        {this.state.countryWasClicked && (
          <CountryPopUp
            name={this.state.name}
            countryISO3={this.state.countryISO3}
            closeModal={() =>
              this.setState({
                countryWasClicked: false
              })
            }
          />
        )}
      </div>
    );
  }
}
