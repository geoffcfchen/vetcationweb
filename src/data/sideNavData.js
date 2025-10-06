const sideNavData = {
  home: [
    {
      groupTitle: "GET STARTED",
      items: [
        {
          id: "introToVetcation",
          label: "Introduction for Veterinarians",
        },
        {
          id: "VirtualClinic",
          label: "Setting Up Your Virtual Clinic",
        },
        {
          id: "ViewingYourUpcomingAppointments",
          label: "View Upcoming Appointments",
        },
        {
          id: "VideoCall",
          label: "Video Call",
        },
        {
          id: "postAppointment",
          label: "Post-Appointment",
        },
        { id: "earnings", label: "Earnings & Wallet" },
        { id: "telemedicineAnalysis", label: "Telemedicine Analysis" },
      ],
    },
    {
      groupTitle: "USER MANUAL",
      items: [
        {
          id: "scheduling", // parent ID
          label: "Scheduling", // label shown in sidebar
          subItems: [
            {
              id: "scheduleOverview",
              label: "Scheduling Overview",
            },
            {
              id: "regularAvailability",
              label: "Regular availability",
            },
            {
              id: "specificAvailability",
              label: "Specific Availability",
            },
            {
              id: "setMinimumNoticeTime",
              label: "Set Minimum Notice Time",
            },
            {
              id: "pauseAvailability",
              label: "Pause Availability",
            },
            {
              id: "mySchedule",
              label: "Manage My Schedule",
            },
          ],
        },
        {
          id: "videoCalls",
          label: "Video Calls",
          subItems: [
            {
              id: "joinVideoCall",
              label: "Join a video call",
            },
            {
              id: "videoCallFeatures",
              label: "Call Features & Settings",
            },
            {
              id: "recordingAndConsent",
              label: "Recording & Consent",
            },
          ],
        },
        {
          id: "InquiryBasedMessager",
          label: "Vetssenger",
          subItems: [
            {
              id: "InquiryBasedMessagerOverView",
              label: "Vetssenger Overview",
            },
            {
              id: "VetssengerVCPRStatus",
              label: "Vetssenger VCPR Status",
            },
            {
              id: "StartNewCase",
              label: "Start a New Case",
            },
            {
              id: "RespondToCase",
              label: "Respond to a Case",
            },
            {
              id: "CloseCase",
              label: "Close/Reopen a Case",
            },
            {
              id: "ViewCaseHistory",
              label: "View Case History",
            },
            {
              id: "VetssengerNotes",
              label: "Vetssenger Notes",
            },
            {
              id: "MedicalRecords",
              label: "Medical Records",
            },
          ],
        },
        {
          id: "Medical Records",
          label: "Medical Records",
          // subItems for E-prescribing basics, etc.
          subItems: [
            {
              id: "MedicalHistoryOverview",
              label: "Medical History Overview",
            },
            {
              id: "DAP",
              label: "Data, Assessment, Plan (DAP)",
            },
            {
              id: "noteforclient",
              label: "Note for Client",
            },
            {
              id: "addprescription",
              label: "Add Prescription",
            },
            {
              id: "pharmacys",
              label: "Pharmacy / client’s choice",
            },
          ],
        },
        {
          id: "marketing",
          label: "Marketing",
          subItems: [
            // {
            //   id: "MarketingOverview",
            //   label: "Marketing Overview",
            // },
            {
              id: "CommunityMarketing",
              label: "Community Marketing",
            },
            {
              id: "partnerWithClinic",
              label: "Partner with a Clinic",
            },
          ],
        },
        // ... you can add more
      ],
    },
    {
      groupTitle: "Regulatory Compliance",
      items: [
        {
          id: "Bill1399",
          label: "AB 1399 FAQ",
        },
        {
          id: "VCPR",
          label: "VCPR",
        },
        {
          id: "PrescriptionLimits",
          label: "Prescription Limits",
        },
        {
          id: "PrivacyConfidentiality",
          label: "Privacy and Confidentiality",
        },
        {
          id: "RacehorseCHRBRestrictions",
          label: "Racehorse & CHRB Restrictions",
        },
        {
          id: "RecordKeepingDocumentation",
          label: "Record-Keeping & Documentation",
        },
        {
          id: "MiscellaneousClarifications",
          label: "Miscellaneous Clarifications",
        },
      ],
    },
  ],
  contributors: [
    {
      groupTitle: "Vetcation Contributors",
      items: [
        {
          id: "ourContributors",
          label: "Our Contributors",
        },
      ],
    },
  ],

  onehealth: [
    {
      groupTitle: "Overview",
      items: [
        { id: "collaborationsOverview", label: "Our Collaboration Mission" },
      ],
    },
    {
      groupTitle: "Initiatives",
      items: [
        { id: "ohvsPrupas", label: "One Health Veterinary Solutions" },
        { id: "alignCare", label: "AlignCare (Access to Care)" },
        { id: "dvSafetyNet", label: "Domestic Violence Pet Safety-Net" },
        { id: "oneHealthCoordinator", label: "One Health Coordinator Model" },
        { id: "housingRetention", label: "Housing & Pet Retention" },
        { id: "shelterBehavior", label: "Shelter Behavioral Support" },
        { id: "communityPrevention", label: "Community Prevention Clinics" },
        { id: "getInvolved", label: "Get Involved" },
      ],
    },
  ],

  clinics: [
    {
      groupTitle: "GET STARTED",
      items: [
        {
          id: "clinicIntroToVetcation",
          label: "Introduction for Hospitals",
        },
        {
          id: "VirtualBranch",
          label: "Setting Up Your Virtual Branch",
        },
        { id: "clinicOutcomeAnalysis", label: "Outcome Analysis" },
      ],
    },

    {
      groupTitle: "Regulatory Compliance",
      items: [
        {
          id: "Bill1399",
          label: "AB 1399 FAQ",
        },
        {
          id: "VCPR",
          label: "VCPR",
        },
        {
          id: "PrescriptionLimits",
          label: "Prescription Limits",
        },
        {
          id: "PrivacyConfidentiality",
          label: "Privacy and Confidentiality",
        },
        {
          id: "RacehorseCHRBRestrictions",
          label: "Racehorse & CHRB Restrictions",
        },
        {
          id: "RecordKeepingDocumentation",
          label: "Record-Keeping & Documentation",
        },
        {
          id: "MiscellaneousClarifications",
          label: "Miscellaneous Clarifications",
        },
      ],
    },
  ],

  corporations: [
    {
      groupTitle: "GET STARTED",
      items: [
        {
          id: "corpIntroToVetcation",
          label: "Introduction for Corporate Veterinary Groups",
        },
      ],
    },
    {
      groupTitle: "Regulatory Compliance",
      items: [
        {
          id: "Bill1399",
          label: "AB 1399 FAQ",
        },
        {
          id: "VCPR",
          label: "VCPR",
        },
        {
          id: "PrescriptionLimits",
          label: "Prescription Limits",
        },
        {
          id: "PrivacyConfidentiality",
          label: "Privacy and Confidentiality",
        },
        {
          id: "RacehorseCHRBRestrictions",
          label: "Racehorse & CHRB Restrictions",
        },
        {
          id: "RecordKeepingDocumentation",
          label: "Record-Keeping & Documentation",
        },
        {
          id: "MiscellaneousClarifications",
          label: "Miscellaneous Clarifications",
        },
      ],
    },
  ],

  compliance: [
    {
      groupTitle: "Regulatory Compliance",
      items: [
        {
          id: "Bill1399",
          label: "AB 1399 FAQ",
        },
        {
          id: "VCPR",
          label: "VCPR",
        },
        {
          id: "PrescriptionLimits",
          label: "Prescription Limits",
        },
        {
          id: "PrivacyConfidentiality",
          label: "Privacy and Confidentiality",
        },
        {
          id: "RacehorseCHRBRestrictions",
          label: "Racehorse & CHRB Restrictions",
        },
        {
          id: "RecordKeepingDocumentation",
          label: "Record-Keeping & Documentation",
        },
        {
          id: "MiscellaneousClarifications",
          label: "Miscellaneous Clarifications",
        },
      ],
    },
  ],

  rvts: [
    {
      groupTitle: "RVT",
      items: [
        {
          id: "introToRVT",
          label: "Intro to RVT",
        },
      ],
    },
  ],
};

export default sideNavData;
