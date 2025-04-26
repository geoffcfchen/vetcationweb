// ./components/InteractiveMapBlock.jsx
import React, { useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import styled from "styled-components";
import { darkMapStyle } from "../data/darkMapStyle";

const containerStyle = { width: "100%", height: "400px", borderRadius: "12px" };

const IWContent = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 14px;
    color: #111; /* very dark gray for better contrast */
  }
  small {
    font-size: 12px;
    color: #666;
  }

  &:hover {
    background: #f9f9f9; /* subtle hover state */
    border-radius: 4px;
  }
`;
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
      options={{
        styles: darkMapStyle, // ← here’s the dark theme
        fullscreenControl: false,
        mapTypeControl: false,
        clickableIcons: false,
      }}
    >
      {block.markers.map((m, i) => (
        <MarkerF
          key={i}
          position={m.position}
          onMouseOver={() => setActive(i)}
          onClick={() => window.open(m.website, "_blank")}
          //   icon={{
          //     path: window.google.maps.SymbolPath.CIRCLE,
          //     scale: 6, // size of the circle
          //     fillColor: "#00E676", // your brand color
          //     fillOpacity: 1,
          //     strokeWeight: 0,
          //   }}
        />
      ))}

      {active !== null && (
        <InfoWindowF
          position={block.markers[active].position}
          onCloseClick={() => setActive(null)}
          options={{
            pixelOffset: new google.maps.Size(0, -10), // lift it up a bit
            maxWidth: 200,
          }}
        >
          {/* <div
            style={{
              cursor: "pointer",
              color: "#000", // dark text on white background
              whiteSpace: "nowrap",
            }}
            onClick={() => window.open(block.markers[active].website, "_blank")}
          >
            <strong>{block.markers[active].name}</strong>
            <br />
            <small>Visit site ↗</small>
          </div> */}
          <IWContent
            onClick={() => window.open(block.markers[active].website, "_blank")}
          >
            <strong>{block.markers[active].name}</strong>
            <small>Visit site ↗</small>
          </IWContent>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

export default React.memo(InteractiveMapBlock);
