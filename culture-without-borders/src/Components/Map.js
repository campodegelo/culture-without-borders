import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import axios from "../axios";
// import geoJson from "../countries.geo.json";
// import geoJson from "../custom.geo.json";
import geoJson from "../countries-land-10km.geo.json";

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

    // axios.get("/getMap").then(({ data }) => {
    //   console.log("data from /getMap : ", data);
    // });

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    // console.log("map from function: ", map);

    // LOAD COORDINATES AND BORDER INFO FROM getJSON FILE
    map.on("load", function() {
      map.addSource("countries", {
        type: "geojson",
        data: geoJson,
        generateId: true
      });

      // map.addLayer({
      //   id: "countries-layer",
      //   type: "fill",
      //   source: "countries",
      //   layout: {},
      //   paint: {
      //     "fill-color": "yellow",
      //     "fill-opacity": 0.1
      //   }
      // });

      // Two layers are added to give a hover effect
      map.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries",
        layout: {},
        paint: {
          "fill-color": "yellow",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.5
          ]
        }
      });

      map.addLayer({
        id: "borders-layer",
        type: "line",
        source: "countries",
        layout: {},
        paint: {
          "line-color": "yellow",
          "line-width": 1
        }
      });
    });

    map.on("click", "countries-layer", function(e) {
      console.log("country name = ", e.features[0]);
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
  }

  render() {
    return (
      <div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}
