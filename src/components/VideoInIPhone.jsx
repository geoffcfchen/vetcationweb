import React from "react";
import styled from "styled-components";
import iPhoneFrame from "../images/iphone-frame.png"; // Path to your iPhone frame image

const VideoContainer = styled.div`
  position: relative;
  width: 300px; // Adjust this to fit the size of your iPhone frame image
  height: 600px; // Adjust this to fit the size of your iPhone frame image
  margin: 0 auto; // Center the container
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 50px; // Adjust this value to position the video correctly within the frame
  left: 10px; // Adjust this value to position the video correctly within the frame
  width: 280px; // Adjust this to fit the screen size of your iPhone frame
  height: 500px; // Adjust this to fit the screen size of your iPhone frame
`;

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

function VideoInIPhone({ videoSrc }) {
  return (
    <VideoContainer>
      <StyledVideo src={videoSrc} controls />
      <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
    </VideoContainer>
  );
}

export default VideoInIPhone;
