import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import {
  AiOutlineClose,
  AiOutlinePicture,
  AiOutlineGlobal,
} from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import ProfilePicture from "../components/ProfilePicture";
import colors from "../config/colors";
import GlobalContext from "../context/GlobalContext";
// import updatePoints from "../utility/updatePoints";
// import MediaPreviewList from "../components/MediaPreviewList";
// import AppText from "../components/AppText";
import moment from "moment";
import { saveNotificationToFirestore } from "../utility/notificationService";

const fromNowShort = (date) => {
  const now = moment();
  const createdAt = moment(date);
  const diffMinutes = now.diff(createdAt, "minutes");
  const diffHours = now.diff(createdAt, "hours");
  const diffDays = now.diff(createdAt, "days");

  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return createdAt.format("MM/DD");
};

export default function NewCommentScreen({ onCloseTweet, tweet, collection }) {
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { userData } = useContext(GlobalContext);

  const commentInputRef = useRef(null);

  const onPostComment = async () => {
    if (!comment.trim()) {
      alert("Error: Comment cannot be empty");
      return;
    }

    try {
      // Placeholder for post creation logic
      setComment("");
      alert("Comment posted!");
      onCloseTweet();
    } catch (error) {
      console.error(error);
      alert("Failed to post comment");
    }
  };

  const handleVisibilityChange = (visibility) => {
    setIsPublic(visibility);
    setModalVisible(false);
  };

  return (
    <>
      {modalVisible && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Who can see your post?</ModalHeader>
            <VisibilityOption onClick={() => handleVisibilityChange(true)}>
              <AiOutlineGlobal size={30} color={colors.tint} />
              <OptionText>Public: everyone can see your posts</OptionText>
            </VisibilityOption>
            <VisibilityOption onClick={() => handleVisibilityChange(false)}>
              <FaUsers size={30} color={colors.tint} />
              <OptionText>
                Followers: only followers can see your posts
              </OptionText>
            </VisibilityOption>
          </ModalContent>
        </ModalOverlay>
      )}

      <Container>
        <Header>
          <CloseButton onClick={onCloseTweet}>
            <AiOutlineClose size={24} color={colors.tint} />
          </CloseButton>
          <PostButton onClick={onPostComment}>Post</PostButton>
        </Header>

        <CommentSection>
          <ProfilePicture userData={userData} size={40} />
          <CommentInput
            ref={commentInputRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Post your reply"
          />
        </CommentSection>

        <OptionsContainer>
          <IconButton onClick={() => setModalVisible(true)}>
            <AiOutlineGlobal size={24} color={colors.tint} />
            <VisibilityLabel>
              {isPublic ? "Public" : "Followers"}
            </VisibilityLabel>
          </IconButton>
          <IconButton
            onClick={() => {
              /* Placeholder for media picker */
            }}
          >
            <AiOutlinePicture size={24} color={colors.tint} />
          </IconButton>
        </OptionsContainer>
      </Container>
    </>
  );
}

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const PostButton = styled.button`
  background-color: ${colors.tint};
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
`;

const CommentSection = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
`;

const CommentInput = styled.textarea`
  width: 100%;
  margin-left: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  resize: none;
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid lightgrey;
  padding-top: 10px;
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const VisibilityLabel = styled.span`
  margin-left: 5px;
  color: ${colors.tint};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
`;

const ModalHeader = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const VisibilityOption = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  cursor: pointer;
`;

const OptionText = styled.span`
  margin-left: 15px;
  font-size: 16px;
`;
