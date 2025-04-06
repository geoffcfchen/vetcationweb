// ./components/FramedImageBlock.jsx
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import iPhoneFrame from "../images/iphone-frame_15pro.png"; // Adjust the path as needed

const VideoFrameContainer = styled.div`
  position: relative;
  width: 300px; /* match your iPhoneFrame's width */
  height: 600px; /* match your iPhoneFrame's height */
  margin: 2rem auto; /* center it horizontally, with some spacing */
`;

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none; /* so the frame doesn't block interactions */
`;

const FramedImage = styled(motion.img)`
  position: absolute;
  top: 1.5%;
  left: 1.5%;
  width: 97%;
  height: 97%;
  object-fit: contain;
  border-radius: 30px; /* Adjust this value to match your iPhone frame’s rounded corners */
`;

const InnerFrame = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px; /* Adjust as needed */
`;

const FramedImageBlock = ({ block }) => {
  // block should have a structure like:
  // {
  //   type: "framedImage",
  //   heading: "Screenshots",
  //   imageSrcs: [ ...array of image URLs... ]
  // }
  const { heading, imageSrcs = [] } = block;

  // Define framer-motion variants for animation (optional)
  const imageVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", duration: 0.8 },
    },
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {heading && (
        <h3 style={{ marginBottom: "1rem", color: "#fff" }}>{heading}</h3>
      )}

      {/* Container for multiple frames side-by-side (or wrapping) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0rem",
          justifyContent: "space-evenly",
        }}
      >
        {imageSrcs.map((src, idx) => (
          <VideoFrameContainer key={idx}>
            <InnerFrame>
              <FramedImage
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                src={src}
                alt={`framed-screenshot-${idx}`}
              />
            </InnerFrame>
            <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
          </VideoFrameContainer>
        ))}
      </div>
    </div>
  );
};

export default FramedImageBlock;
