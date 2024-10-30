import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { FiTrash2, FiMoreHorizontal } from "react-icons/fi"; // Import specific Feather icons
import moment from "moment";
// import { toast } from "react-toastify";

// import Footer from "./Footer";
import FooterQA from "../../FooterQA";
import NameBadge from "../../NameBadge";
import useGetSingleUser from "../../../hooks/useGetSingleUser";
// import ReportButton from "../../ReportButton";
import colors from "../../../config/colors";
import GlobalContext from "../../../context/GlobalContext";
import MediaDisplay from "../../MediaDisplay";
import AppText from "../../AppText";
// import PostEditButton from "../../PostEditButton";

const Container = styled.div`
  margin-left: 10px;
  margin-right: 2px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderNames = styled.div`
  display: flex;
  align-items: center;
`;

const Username = styled.span`
  margin-right: 5px;
  color: grey;
`;

const Content = styled.p`
  margin-top: 0;
`;

const CreatedAt = styled.p`
  font-size: 13px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  color: grey;
`;

function MainContainerComment({
  tweet,
  commentCollectionName,
  onRemoveBlockedPost,
}) {
  const username = tweet.user.userName || tweet.user.email.split("@")[0];
  const { user } = useGetSingleUser(tweet.user.uid);
  const [menuVisible, setMenuVisible] = useState(false);
  const { userData } = useContext(GlobalContext);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const deletePost = async (postId, collection) => {
    try {
      // Simulate a delete operation
      onRemoveBlockedPost(postId);
      setMenuVisible(false);

      // Show toast with undo option
      const undoToast = toast("Post deleted", {
        type: "info",
        onClose: () => permanentlyDeletePost(postId, collection),
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  const permanentlyDeletePost = async (postId, collection) => {
    try {
      // Simulate permanent deletion
      console.log(`Post ${postId} permanently deleted from ${collection}`);
    } catch (error) {
      console.error("Error permanently deleting post:", error);
    }
  };

  return (
    <Container>
      <HeaderContainer>
        <HeaderNames>
          <NameBadge userBData={user} />
          <Username>@{username}</Username>
        </HeaderNames>
        <div onClick={toggleMenu}>
          <FiMoreHorizontal
            size={20}
            color={!menuVisible ? "grey" : colors.black}
          />
        </div>
        {menuVisible && (
          <div style={{ backgroundColor: "white", borderRadius: "15px" }}>
            {userData?.uid === tweet.user.uid && (
              <div onClick={() => deletePost(tweet.id, commentCollectionName)}>
                <FiTrash2 size={24} color={colors.danger} />
                Delete Post
              </div>
            )}
            <PostEditButton
              userData={userData}
              tweet={tweet}
              hideMenu={() => setMenuVisible(false)}
              collection={commentCollectionName}
            />
            <ReportButton
              tweet={tweet}
              hideMenu={() => setMenuVisible(false)}
            />
          </div>
        )}
      </HeaderContainer>

      <AppText>{tweet.content}</AppText>
      {/* <MediaDisplay mediaUrls={tweet.mediaUrls} /> */}
      <CreatedAt>
        {tweet.createdAt
          ? moment(tweet.createdAt.toDate()).format("hh:mm A, MM/DD/YYYY")
          : "Unknown date"}
      </CreatedAt>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <FooterQA tweet={tweet} collection={commentCollectionName} comment />
        <FooterQA
          tweet={tweet}
          collection={commentCollectionName}
          comment
          commentHeader
        />
      </div>
    </Container>
  );
}

export default MainContainerComment;
