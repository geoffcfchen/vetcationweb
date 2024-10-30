import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineReply } from "react-icons/md";
import NewCommentScreen from "../screens/NewCommentScreen";
import AppText from "./AppText";
import colors from "../config/colors";
import GlobalContext from "../context/GlobalContext";
import ProfilePicture from "./ProfilePicture";

function NewCommentButton({
  tweet,
  stats,
  collection,
  commentHeader = false,
  FeedDetailReplyButton = false,
}) {
  const { userData } = useContext(GlobalContext);
  const [modalVisible, setModalVisible] = useState(false);

  const onPress = () => {
    if (!commentHeader) setModalVisible(true);
  };

  const onCloseTweet = () => {
    setModalVisible(false);
  };

  return (
    <>
      {modalVisible && (
        <ModalOverlay>
          <ModalContent>
            <NewCommentScreen
              onCloseTweet={onCloseTweet}
              tweet={tweet}
              collection={collection}
            />
          </ModalContent>
        </ModalOverlay>
      )}
      <ButtonContainer onClick={onPress}>
        {collection === "posts" && !FeedDetailReplyButton && (
          <IconContainer>
            {!commentHeader && <FiMessageCircle size={20} color="grey" />}
            <StyledAppText bold={commentHeader} dark={commentHeader}>
              {stats.numberOfComments}
            </StyledAppText>
            {commentHeader && <StyledAppText>Replies</StyledAppText>}
          </IconContainer>
        )}
        {collection === "questions" &&
          !commentHeader &&
          !FeedDetailReplyButton && (
            <IconContainerQA>
              <MdOutlineReply size={15} color="white" />
              <StyledAppText white>
                Reply {stats.numberOfComments}
              </StyledAppText>
            </IconContainerQA>
          )}
        {collection === "questions" &&
          commentHeader &&
          !FeedDetailReplyButton && (
            <IconContainerQA transparent>
              <StyledAppText bold dark marginLeft={0}>
                {stats.numberOfComments}
              </StyledAppText>
              <StyledAppText>Reply</StyledAppText>
            </IconContainerQA>
          )}
        {FeedDetailReplyButton && (
          <ReplyButtonContainer>
            <ProfilePicture
              userData={userData}
              size={35}
              style={{ marginLeft: 13 }}
            />
            <CommentBox>
              <CommentTextContainer>
                <AppText style={{ color: "grey", fontWeight: "500" }}>
                  Add a comment
                </AppText>
              </CommentTextContainer>
            </CommentBox>
          </ReplyButtonContainer>
        )}
      </ButtonContainer>
    </>
  );
}

// Styled components for the layout and styling
const ButtonContainer = styled.div`
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const IconContainerQA = styled(IconContainer)`
  background-color: ${({ transparent }) =>
    transparent ? "transparent" : colors.black};
  padding: 5px 7px;
  border-radius: 15px;
`;

const StyledAppText = styled(AppText)`
  margin-left: ${({ marginLeft }) => marginLeft || "5px"};
  color: ${({ dark, white }) =>
    white ? "white" : dark ? colors.black : "grey"};
  font-weight: ${({ bold }) => (bold ? "bold" : "normal")};
  text-align: center;
`;

const ReplyButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 7px 0;
  align-items: center;
`;

const CommentBox = styled.div`
  background-color: ${colors.lightblue};
  flex: 1;
  border-radius: 30px;
  margin: 0 5px;
  margin-right: 13px;
  display: flex;
  justify-content: center;
`;

const CommentTextContainer = styled.div`
  margin-left: 10px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
`;

export default NewCommentButton;
