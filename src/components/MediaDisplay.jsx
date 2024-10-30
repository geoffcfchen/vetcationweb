import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaPlay } from "react-icons/fa"; // Icon for video

// Styled components
const MediaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const MediaItem = styled.div`
  width: ${({ $count }) => ($count === 1 ? "100%" : "49%")};
  height: ${({ $count }) => ($count === 1 ? "auto" : "400px")};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const VideoThumbnail = styled.div`
  width: 100%;
  height: 100%;
  background: url(${(props) => props.thumbnail}) no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  position: relative;
  border-radius: 10px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }
`;

const MediaDisplay = ({ mediaUrls }) => {
  const navigate = useNavigate();

  const isVideo = (url) => {
    const videoFormats = ["mp4", "mov", "avi"];
    return videoFormats.some((format) => url.endsWith(format));
  };

  const handleMediaClick = (url) => {
    // Navigate to a detailed page for the clicked media item
    // navigate(`/media/${encodeURIComponent(url)}`);
  };

  return (
    <div>
      <MediaContainer>
        {mediaUrls.map((url, index) => (
          <MediaItem
            key={index}
            $count={mediaUrls.length}
            onClick={() => handleMediaClick(url)}
          >
            {isVideo(url) ? (
              <VideoThumbnail thumbnail="/path-to-video-thumbnail.jpg">
                <FaPlay />
              </VideoThumbnail>
            ) : (
              <Image src={url} alt="media" />
            )}
          </MediaItem>
        ))}
      </MediaContainer>
    </div>
  );
};

export default MediaDisplay;
