import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import pin from "../assets/pin.webp";

const ProductLocation = ({ coordinate }) => {
  const [center, setCenter] = useState([...coordinate]);
  const [viewport, setViewport] = useState({
    height: 500,
    latitude: center[1],
    longitude: center[0],
    zoom: 14,
  });

  useEffect(() => {
    setCenter(coordinate);
  }, [coordinate, center]);

  return (
    <ReactMapGL
      {...viewport}
      width={"100%"}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      <Marker latitude={center[1]} longitude={center[0]}>
        <button
          style={{
            border: "transparent",
            background: "transparent",
            cursor: "pointer",
            transform: `translate(${-30 / 2}px,${-30}px)`,
          }}
        >
          <img src={pin} alt="map pin" height="30" width="30" />
        </button>
      </Marker>
    </ReactMapGL>
  );
};

export default ProductLocation;
