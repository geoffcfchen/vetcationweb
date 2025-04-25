// ./components/InteractiveMapBlock.jsx
import React, { useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "400px", borderRadius: "12px" };

function InteractiveMapBlock({ block }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [active, setActive] = React.useState(null);

  const handleMarkerClick = useCallback((idx) => setActive(idx), []);
  const handleMapClick = () => setActive(null);

  if (!isLoaded) return <p style={{ color: "#ccc" }}>Loading map…</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={block.center}
      zoom={block.zoom}
      onClick={handleMapClick}
      options={{ fullscreenControl: false, mapTypeControl: false }}
    >
      {block.markers.map((m, i) => (
        <MarkerF
          key={i}
          position={m.position}
          onMouseOver={() => handleMarkerClick(i)}
          onClick={() => window.open(m.website, "_blank")}
        >
          {active === i && (
            <InfoWindowF onCloseClick={() => setActive(null)}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => window.open(m.website, "_blank")}
              >
                {m.name}
                <br />
                <small>Visit site ↗</small>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
    </GoogleMap>
  );
}

export default React.memo(InteractiveMapBlock);
