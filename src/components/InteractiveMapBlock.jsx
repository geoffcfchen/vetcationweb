// ./components/InteractiveMapBlock.jsx
import React from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  OverlayView,
  InfoWindowF,
} from "@react-google-maps/api";
import styled from "styled-components";
import { darkMapStyle } from "../data/darkMapStyle";

const pinSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="40" viewBox="0 0 24 40">
    <path fill="#00E676" d="M12,0C7.037,0,3,4.037,3,9c0,6.75,7.5,17.667,8.002,18.294C11.502,26.667,19,15.75,19,9
      C19,4.037,14.963,0,12,0z"/>
  </svg>
`);

const containerStyle = { width: "100%", height: "400px", borderRadius: "12px" };

// we target the label <span> via its className "clinic-label"
const MapWrapper = styled.div`
  .clinic-label {
    font-weight: 500;
    font-size: 12px;
    color: #fff;

    /* push the text down 4px */
    transform: translateY(-28px);
  }
`;

const IWContent = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 14px;
    color: #111;
  }
  small {
    font-size: 12px;
    color: #666;
  }

  &:hover {
    background: #f9f9f9;
    border-radius: 4px;
  }
`;

export default React.memo(function InteractiveMapBlock({ block }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });
  const [active, setActive] = React.useState(null);
  const handleMapClick = () => setActive(null);

  if (!isLoaded) return <p style={{ color: "#ccc" }}>Loading map…</p>;

  return (
    <MapWrapper>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={block.center}
        zoom={block.zoom}
        onClick={handleMapClick}
        options={{
          styles: darkMapStyle,
          fullscreenControl: false,
          mapTypeControl: false,
          clickableIcons: false,
        }}
      >
        {block.markers.map((m, i) => (
          <React.Fragment key={i}>
            {/* the marker itself */}
            <MarkerF
              position={m.position}
              onMouseOver={() => setActive(i)}
              onClick={() => window.open(m.website, "_blank")}
              label={{
                text: m.name,
                className: "clinic-label",
                color: "#fff",
              }}
            />

            {/* the static label above the marker */}
          </React.Fragment>
        ))}

        {active !== null && (
          <InfoWindowF
            position={block.markers[active].position}
            onCloseClick={() => setActive(null)}
            options={{
              pixelOffset: new window.google.maps.Size(0, -10),
              maxWidth: 200,
            }}
          >
            <IWContent
              onClick={() =>
                window.open(block.markers[active].website, "_blank")
              }
            >
              <strong>{block.markers[active].name}</strong>
              <small>Visit site ↗</small>
            </IWContent>
          </InfoWindowF>
        )}
      </GoogleMap>
    </MapWrapper>
  );
});
