import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProfilePicture from "../ProfilePicture";
import useGetSingleUser from "../../hooks/useGetSingleUser";
import AppText from "../AppText";
import NameBadge from "../NameBadge";
// import { Menu, Divider, IconButton } from "@mui/material"; // Material UI for Menu and IconButton
import { auth } from "../../firebase";
// import ReportButton from "../ReportButton";
import colors from "../../config/colors";
// import PostEditButton from "../PostEditButton";
import GlobalContext from "../../context/GlobalContext";

function LeftContainerCommentHeader({
  tweet,
  collection,
  fetchTweetDetails = null,
  tweetExists = true,
}) {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const { userData } = useContext(GlobalContext);

  const closeMenu = () => setMenuVisible(false);

  const { user: parsedCustomers } = useGetSingleUser(tweet.user.uid);
  const username = parsedCustomers?.userName
    ? parsedCustomers?.userName
    : parsedCustomers?.email.substr(0, parsedCustomers?.email.indexOf("@"));

  return (
    <TweetHeaderContainer>
      <UserInfoContainer>
        <ProfilePicture
          userData={parsedCustomers}
          size={45}
          onClick={() =>
            navigate("/profile", { state: { ProfileUser: parsedCustomers } })
          }
        />
        <UserInfoText>
          <NameBadge userBData={parsedCustomers} maxLength={32} />
          <AppText style={{ color: "grey" }}>
            @{parsedCustomers?.username || username}
          </AppText>
        </UserInfoText>
      </UserInfoContainer>

      {tweetExists && (
        <MenuContainer>
          {/* <IconButton
            onClick={() => setMenuVisible(!menuVisible)}
            style={{ padding: 0 }}
          >
            <span
              style={{
                fontSize: 20,
                color: menuVisible ? colors.black : "grey",
              }}
            >
              ⋮
            </span>
          </IconButton> */}
          {/* <Menu
            open={menuVisible}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={{
              style: { borderRadius: 15, backgroundColor: "white" },
            }}
          >
            {auth.currentUser?.uid === tweet.user.uid && (
              <PostEditButton
                userData={userData}
                tweet={tweet}
                hideMenu={closeMenu}
                collection={collection}
                fetchTweetDetails={fetchTweetDetails}
              />
            )}
            {auth.currentUser?.uid === tweet.user.uid && !tweet.topComment && (
              <Divider />
            )}
            <ReportButton tweet={tweet} hideMenu={closeMenu} />
          </Menu> */}
        </MenuContainer>
      )}
    </TweetHeaderContainer>
  );
}

// Styled Components
const TweetHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 7px;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const UserInfoText = styled.div`
  margin-left: 10px;
  flex: 1;
`;

const MenuContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default LeftContainerCommentHeader;
