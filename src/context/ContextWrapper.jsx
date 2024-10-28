// src/context/ContextWrapper.js
import React, { useState } from "react";

import { theme } from "../config/colors"; // Ensure the theme file is accessible for the web
import GlobalContext from "./GlobalContext";

export default function ContextWrapper(props) {
  const [rooms, setRooms] = useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = useState([]);
  const [questionId, setQuestionId] = useState([]);
  const [unfilteredQuestions, setUnfilteredQuestions] = useState([]);
  const [userData, setUserData] = useState();
  const [petOwners, setPetOwners] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [unfilteredDoctors, setUnfilteredDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [whereTab, setWhereTab] = useState("");
  const [isDrawerSwipable, setIsDrawerSwipable] = useState(true);
  const [isDrawerSwiping, setIsDrawerSwiping] = useState(false);

  const [allUsersThatUserFollowing, setAllUsersThatUserFollowing] = useState(
    []
  );
  const [followersOfUser, setFollowersOfUser] = useState([]);
  const [calleeB, setCalleeB] = useState({});
  const [incomingCallId, setIncomingCallId] = useState(null);
  const [callId, setCallId] = useState(null);
  const [tabBarDisplay, setTabBarDisplay] = useState("true");
  const [conversationView, setConversationView] = useState("active"); // 'active' or 'archived'
  const [clinicOwner, setClinicOwner] = useState({});

  const [currentHomeView, setCurrentHomeView] = useState("QA");

  return (
    <GlobalContext.Provider
      value={{
        clinicOwner,
        setClinicOwner,
        theme,
        rooms,
        setRooms,
        unfilteredRooms,
        setUnfilteredRooms,
        questionId,
        setQuestionId,
        unfilteredQuestions,
        setUnfilteredQuestions,
        userData,
        setUserData,
        petOwners,
        setPetOwners,
        doctors,
        setDoctors,
        unfilteredDoctors,
        setUnfilteredDoctors,
        timeSlots,
        setTimeSlots,
        whereTab,
        setWhereTab,
        isDrawerSwipable,
        setIsDrawerSwipable,
        isDrawerSwiping,
        setIsDrawerSwiping,
        allUsersThatUserFollowing,
        setAllUsersThatUserFollowing,
        followersOfUser,
        setFollowersOfUser,
        calleeB,
        setCalleeB,
        incomingCallId,
        setIncomingCallId,
        callId,
        setCallId,
        tabBarDisplay,
        setTabBarDisplay,
        currentHomeView,
        setCurrentHomeView,
        conversationView,
        setConversationView,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
