import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import geoJson from "../countries.geo.json";

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
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    map.on("load", function() {
      map.addSource("countries", {
        type: "geojson",
        data: geoJson
      });

      map.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries",
        layout: {},
        paint: {
          "fill-color": "#1a1d62",
          "fill-opacity": 0.8
        }
      });
    });

    map.on("click", "countries-layer", function(e) {
      console.log("country name = ", e.features[0].properties);
      // console.log("country ISO = ", e.features[0].id);
      // let popup = new mapboxgl.PopUp()
      //   .setLngLat(e.lngLat)
      //   .setHTML(e.features[0].properties.name)
      //   .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the states layer.
    map.on("mouseenter", "countries-layer", function() {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "countries-layer", function() {
      map.getCanvas().style.cursor = "";
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
