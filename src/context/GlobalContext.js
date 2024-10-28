// src/context/GlobalContext.js
import React from "react";

const GlobalContext = React.createContext({
  theme: {},
  rooms: [],
  setRooms: () => {},
  unfilteredRooms: [],
  setUnfilteredRooms: () => {},

  questionId: [],
  setQuestionId: () => {},

  unfilteredQuestions: [],
  setUnfilteredQuestions: () => {},

  userData: [],
  setUserData: () => {},

  petOwners: [],
  setPetOwners: () => {},

  doctors: [],
  setDoctors: () => {},

  unfilteredDoctors: [],
  setUnfilteredDoctors: () => {},

  timeSlots: [],
  setTimeSlots: () => {},

  whereTab: "",
  setWhereTab: () => {},

  isDrawerSwipable: true,
  setIsDrawerSwipable: () => {},

  isDrawerSwiping: false,
  setIsDrawerSwiping: () => {},

  allUsersThatUserFollowing: [],
  setAllUsersThatUserFollowing: () => {},

  followersOfUser: [],
  setFollowersOfUser: () => {},

  calleeB: {},
  setCalleeB: () => {},

  incomingCallId: null,
  setIncomingCallId: () => {},

  callId: null,
  setCallId: () => {},

  tabBarDisplay: "true",
  setTabBarDisplay: () => {},

  clinicOwner: {},
  setClinicOwner: () => {},

  currentHomeView: "QA",
  setCurrentHomeView: () => {},

  conversationView: "active",
  setConversationView: () => {},
});

export default GlobalContext;
