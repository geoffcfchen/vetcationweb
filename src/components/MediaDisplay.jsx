import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal"; // Using react-modal for full-screen display
import { FaPlay } from "react-icons/fa"; // Icon for video

// Styled components
const MediaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const MediaItem = styled.div`
  width: ${({ $count }) =>
    $count === 1
      ? "100%"
      : "49%"}; // Adjust width based on media count using transient prop
  height: ${({ $count }) =>
    $count === 1
      ? "auto"
      : "150px"}; // Adjust height based on media count using transient prop
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

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  width: 100vw;
  height: 100vh;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  color: white;
  font-size: 20px;
  cursor: pointer;
  border: none;
`;

Modal.setAppElement("#root"); // To set up accessibility for modal

const MediaDisplay = ({ mediaUrls }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const isVideo = (url) => {
    const videoFormats = ["mp4", "mov", "avi"];
    return videoFormats.some((format) => url.endsWith(format));
  };

  const handleMediaClick = (url) => {
    setSelectedMedia(url);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div>
      <MediaContainer>
        {mediaUrls.map((url, index) => (
          <MediaItem
            key={index}
            $count={mediaUrls.length} // Use the transient prop $count to prevent passing it to the DOM
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

      {/* Full-screen modal for viewing media */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          style={{ overlay: { background: "rgba(0, 0, 0, 0.8)" } }}
        >
          <ModalContent>
            {isVideo(selectedMedia) ? (
              <video
                src={selectedMedia}
                controls
                style={{ width: "80vw", height: "auto" }}
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Selected media"
                style={{ width: "80vw", height: "auto" }}
              />
            )}
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default MediaDisplay;
