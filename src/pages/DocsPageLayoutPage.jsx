import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Offcanvas } from "react-bootstrap";
import AccordionItem from "../components/accordion/AccordionItem";
import MySidebar from "../components/Sidebar/MySidebar";
import RightSideBar from "../components/Sidebar/RightSideBar";
import iPhoneFrame from "../images/iphone-frame_15pro.png"; // same frame image as in Feature.jsx
import { motion } from "framer-motion";

// ===================== STYLED COMPONENTS ===================== //

// A container for the entire page
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #111; /* Dark background to match the LiveKit theme */
  color: #fff;

  @media (max-width: 576px) {
    // On very small screens, remove fixed height
    min-height: auto;
  }
`;

// Top navigation bar (Home, AI Agents, Telephony, etc.)
const TopNavBar = styled.nav`
  background-color: #111;
  padding: 1rem;
  display: flex;
  gap: 2rem;
  align-items: center;
`;

// Each link in the top nav
const TopNavLink = styled.span`
  cursor: pointer;
  color: ${(props) => (props.$active ? "#00bcd4" : "#ccc")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};

  &:hover {
    color: #fff;
  }
`;

// Middle content area
const MainContent = styled.div`
  background-color: #1c1c1c;
  padding: 2rem;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 768px) {
    // If desired, reduce padding on small screens
    padding: 1rem;
  }
`;

// Right sidebar
// const RightSidebar = styled.div`
//   background-color: #1c1c1c;
//   height: 100%;
//   padding: 1rem;
//   overflow-y: auto;
// `;

// An item in the right sidebar "On this page" section
const TocItem = styled.div`
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: ${(props) => (props.active ? "#fff" : "#ccc")};

  &:hover {
    color: #fff;
  }
`;

export const AccordionContainer = styled.div`
  border: 1px solid #333;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
`;

export const AccordionHeader = styled.div`
  background-color: #1c1c1c;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  font-weight: bold;
  color: #ccc;

  &:hover {
    background-color: #2a2a2a;
  }
`;

export const AccordionBody = styled.div`
  background-color: #000;
  color: #ccc;
  padding: 1rem;
  line-height: 1.6;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const BulletList = styled.ul`
  list-style: disc;
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: #ccc;

  .highlight {
    font-weight: bold;
    color: #fff;
  }
`;

const BulletListItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

// =============== MOCK DATA STRUCTURES =============== //

/**
 * topNavData - array of top-level sections in the top nav bar
 * Each item has an `id` plus a display `label`.
 */
const topNavData = [
  { id: "home", label: "For veterinarians" },
  //   { id: "aiAgents", label: "AI Agents" },
  //   { id: "telephony", label: "Telephony" },
  //   { id: "recipes", label: "Recipes" },
  //   { id: "reference", label: "Reference" },
];

/**
 * sideNavData - For each topNav "id", we store an array of "groups".
 * Example: for "home", we have "Get Started" group with sub-items.
 */
const sideNavData = {
  home: [
    {
      groupTitle: "GET STARTED",
      items: [
        {
          id: "introToVetcation",
          label: "Intro to Vetcation",
        },
        {
          id: "VirtualClinic",
          label: "Setting Up Your Virtual Clinic",
        },
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
              id: "setMinimumNoticeTime",
              label: "Set Minimum Notice Time",
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
          id: "InquiryBasedMessaging",
          label: "Inquiry-Based Messaging",
          subItems: [
            {
              id: "sendChargeableMessage",
              label: "Send a chargeable message",
            },
            {
              id: "respondToMessage",
              label: "Respond to a message",
            },
          ],
        },
        {
          id: "prescriptions",
          label: "Prescriptions",
          // subItems for E-prescribing basics, etc.
          subItems: [
            { id: "eprescribing", label: "E-prescribing basics" },
            {
              id: "pharmacyIntegrations",
              label: "Pharmacy integrations / client’s choice",
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
};

// Reuse exactly the same styles you used in Feature.jsx:
const VideoFrameContainer = styled.div`
  position: relative;
  width: 300px; /* match your iPhoneFrame's width */
  height: 600px; /* match your iPhoneFrame's height */
  margin: 2rem auto; /* center it horizontally, with some spacing */
`;

const FrameImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none; // so the frame doesn't block interactions
`;

const FramedImage = styled.img`
  position: absolute;
  top: 1.5%;
  left: 1.5%;
  width: 97%;
  height: 97%;
  object-fit: contain;
  border-radius: 30px; /* Adjust this value to match your iPhone frame’s rounded corners */
`;

const InnerFrame = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px; /* Adjust as needed */
`;

// Define the block component
function FramedImageBlock({ block }) {
  // block will contain something like:
  // {
  //   type: "framedImage",
  //   heading: "Screenshots",
  //   imageSrcs: [ ...array of image URLs... ]
  // }
  const { heading, imageSrcs = [] } = block;

  // optional: define framer variants if you want an animation
  const imageVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", duration: 0.8 },
    },
  };

  // If you do not want animations at all, either remove `motion` or
  // just pass a regular <img />. For now, let's keep them in.
  return (
    <div style={{ marginTop: "2rem" }}>
      {heading && (
        <h3 style={{ marginBottom: "1rem", color: "#fff" }}>{heading}</h3>
      )}

      {/* Container for multiple frames side-by-side (or wrapping) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0rem",
          justifyContent: "space-evenly",
        }}
      >
        {imageSrcs.map((src, idx) => (
          <VideoFrameContainer key={idx}>
            <InnerFrame>
              <FramedImage
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                src={src}
                alt={`framed-screenshot-${idx}`}
              />
            </InnerFrame>
            <FrameImage src={iPhoneFrame} alt="iPhone Frame" />
          </VideoFrameContainer>
        ))}
      </div>
    </div>
  );
}

const QAContentBlock = ({ block }) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{ fontWeight: "bold", color: "#00bcd4" }}>{block.question}</p>
      <p style={{ marginLeft: "1rem", color: "#ccc" }}>{block.answer}</p>
      {block.example && (
        <p style={{ marginLeft: "1rem", fontStyle: "italic", color: "#ccc" }}>
          <strong>Example:</strong> {block.example}
        </p>
      )}
      {block.helpText && (
        <div
          style={{
            backgroundColor: "#111", // darker background
            border: "1px solid #b1dbe3", // accent border
            borderRadius: "6px",
            padding: "1rem",
            marginTop: "1rem",
            marginLeft: "1rem",
            color: "#ccc",
          }}
        >
          <strong style={{ color: "#00bcd4" }}>How Vetcation Helps:</strong>{" "}
          {block.helpText}
        </div>
      )}
    </div>
  );
};

const BulletListBlock = ({ block }) => {
  return (
    <BulletList>
      {block.items.map((item, index) => {
        const { heading = "", lines = [] } = item;

        return (
          <BulletListItem key={index}>
            {heading && (
              <span style={{ fontWeight: "bold", color: "#fff" }}>
                {heading}
              </span>
            )}

            {lines.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {lines.map((line, lineIdx) => (
                  <li
                    key={`line-${lineIdx}`}
                    dangerouslySetInnerHTML={{ __html: line }}
                    style={{ marginBottom: "0.25rem" }}
                  />
                ))}
              </ul>
            )}
          </BulletListItem>
        );
      })}
    </BulletList>
  );
};

const TrendContainer = styled.div`
  margin-bottom: 1.5rem;
  color: #ccc;
  line-height: 1.6;

  /* Highlight style now only makes text bold */
  .highlight {
    font-weight: bold;
    color: #fff;
  }
`;

const TrendHeading = styled.span`
  font-weight: bold;
  color: #fff;
`;

const TrendPointsBlock = ({ block }) => {
  const { introParagraphs = [], items = [] } = block;

  return (
    <TrendContainer>
      {introParagraphs.map((para, i) => (
        <p key={`intro-${i}`} style={{ marginBottom: "1rem" }}>
          {para}
        </p>
      ))}

      <ul style={{ paddingLeft: "1.2rem" }}>
        {items.map((item, idx) => (
          <li key={`item-${idx}`} style={{ marginBottom: "1rem" }}>
            {item.heading && <TrendHeading>{item.heading}</TrendHeading>}

            {item.lines && item.lines.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.2rem" }}>
                {item.lines.map((line, lineIdx) => (
                  <li
                    key={`line-${lineIdx}`}
                    style={{ marginBottom: "0.5rem" }}
                    // Render HTML in each line
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </TrendContainer>
  );
};

/**
 * contentData - For each left sidebar item (e.g. "introToVetcation"), we store the
 * main content sections. Each section has:
 *   - id: unique ID to match with IntersectionObserver
 *   - title: subheading displayed in the middle column (like "Why choose LiveKit?")
 *   - text: paragraph text (can be an array of paragraphs or any React element)
 */
const contentData = {
  introToVetcation: {
    mainTitle: "Introduction to Vetcation",
    mainDescription: `
      Vetcation is an all-in-one telemedicine and virtual clinic platform tailored 
      for licensed veterinarians in California. Whether you’re looking to bolster 
      your existing practice with flexible virtual care or launch a fully remote 
      clinic, Vetcation streamlines everything from scheduling and record-keeping 
      to legal compliance under AB 1399. Below you'll see how our platform empowers 
      you to work from anywhere, enhance client relationships, and keep more of 
      the revenue you earn—all while remaining audit-ready and legally protected.`,
    sections: [
      {
        id: "achieveWithVetcation",
        title: "What Can You Achieve with Vetcation?",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Maximize Your Earning Potential:",
                lines: [
                  "Retain up to 70% of the revenue from your virtual services, potentially exceeding $300,000 per year if you choose to work about 40 hours per week.",
                ],
              },
              {
                heading: "Build Your Own Virtual Clinic & Client Base:",
                lines: [
                  "Establish and grow your digital practice on your terms—nurture strong, long-term client relationships, fully under your brand.",
                ],
              },
              {
                heading: "Practice from Anywhere, Anytime:",
                lines: [
                  "Enjoy the freedom to work wherever you have an internet connection—be it your home office or a beach on the other side of the world—while maintaining total control over your schedule.",
                ],
              },
              {
                heading: "AI-Powered Workflows:",
                lines: [
                  "Streamline administrative tasks and elevate efficiency with robust AI assistance, from automated record creation to simplified client follow-ups.",
                ],
              },
              {
                heading: "Stay Legally Protected Under AB 1399:",
                lines: [
                  "Vetcation’s automated workflows help you maintain compliance with California’s evolving telehealth regulations, so you can focus on patient care instead of worrying about the fine print.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "whyChooseVetcation",
        title: "Why Choose Vetcation?",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "All-Inclusive Virtual Clinic Tools:",
                lines: [
                  "Go beyond simple video calls with scheduling, billing, secure records, pharmacy integrations, and robust telemedicine features to run a complete remote practice.",
                ],
              },
              {
                heading: "Decentralized Medical Records:",
                lines: [
                  "Manage your clinic’s patient files in a centralized, encrypted environment. Your records stay compliant, secure, and instantly accessible—mirroring in-person best practices.",
                ],
              },
              {
                heading: "Flexible Scheduling Made Easy:",
                lines: [
                  "Set your own hours, enable last-minute booking or preplanned availability, and adjust as needed—so your virtual clinic runs on your schedule, not the other way around.",
                ],
              },
              {
                heading: "Messaging & Asynchronous Follow-Ups:",
                lines: [
                  "Chargeable chat or messaging consultations let you handle non-urgent queries and follow-up care on your terms, without requiring full appointments for every question.",
                ],
              },
              {
                heading: "Pharmacy Freedom:",
                lines: [
                  "Offer prescription pick-up at virtually any pharmacy—including big-box chains, local independents, or mail-order options—giving your clients choice and convenience.",
                ],
              },
              {
                heading: "Confident Compliance:",
                lines: [
                  "Our platform incorporates AB 1399 rules and BPC guidance at every step, ensuring that forming a VCPR, prescribing meds, and documenting are all done correctly.",
                ],
              },
              {
                heading: "AI-Assisted Documentation:",
                lines: [
                  "Accelerate note-taking with auto-generated appointment summaries and medical records based on the live video session—saving time while maintaining accuracy.",
                ],
              },
              {
                heading: "Dedicated Technical & Regulatory Support:",
                lines: [
                  "Our support team is here to help you optimize your practice and stay updated on any new legal developments affecting veterinary telemedicine.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "whyVirtualCareTrend",
        title: "Why Virtual Care Is Growing—And Why It Matters",
        blocks: [
          {
            type: "trendPoints",
            introParagraphs: [
              "Veterinary medicine is experiencing a dynamic shift, driven by the rising demand for convenient, accessible care. The latest VVCA State of Veterinary Virtual Care Report (2024) highlights why veterinarians should embrace telehealth sooner than later:",
            ],
            items: [
              {
                heading: "Critical Shortages in Veterinary Services:",
                lines: [
                  `Over 22% of U.S. counties have <span class="highlight">no veterinary employees</span>, leaving millions of companion animals in <span class="highlight">underserved areas</span> (VVCA Report 2024, p. 7).`,
                  `The country faces a deficit of <span class="highlight">12,000 veterinarians</span> and <span class="highlight">48,000 support staff</span>, demanding innovative solutions like telemedicine (VVCA Report 2024, p. 7).`,
                ],
              },
              {
                heading: "Rapid Consumer Adoption:",
                lines: [
                  "Telehealth has become a key access point for pet owners seeking immediate answers—50% of global virtual consults address symptomatic issues (VVCA Report 2024, p. 10).",
                  "High demand and convenience are fueling telehealth’s growth, with pet owners embracing virtual visits to save travel time and reduce stress on their animals.",
                ],
              },
              {
                heading: "Synergy with In-Person Care:",
                lines: [
                  "Telemedicine consultations supplement physical visits, allowing continuous follow-up for chronic or non-emergency conditions, while maximizing clinic efficiency.",
                  "Over half of treatment consultations (58.4%) effectively resolved the issue without an immediate clinic visit, reducing in-person congestion (VVCA Report 2024, p. 21).",
                ],
              },
              {
                heading: "Greater Efficiency & Cost Savings:",
                lines: [
                  "Practices that adopt telehealth often see reduced no-shows, more organized scheduling, and operational savings, boosting both profit and patient satisfaction (VVCA Report 2024).",
                ],
              },
              {
                heading: "High Client Satisfaction:",
                lines: [
                  "Virtual interactions garner an average 98.4% satisfaction rate—pet owners appreciate the convenience and immediate access to professional advice (VVCA Report 2024, p. 14).",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  VirtualClinic: {
    mainTitle: "Build Your Virtual Clinic with Vetcation",
    mainDescription: `Vetcation empowers California-licensed veterinarians to transform remote care into a complete digital practice. 
Our platform goes beyond basic telemedicine by enabling you to build a branded virtual clinic—complete with secure recordkeeping, 
automated scheduling, and client management—all while staying fully compliant with AB 1399. Learn the difference between telemedicine 
and a virtual clinic, the legal Compliance, and follow simple steps to set up your own clinic from anywhere.`,
    sections: [
      {
        id: "diffTelemedVirtualClinic",
        title: "Telemedicine vs. Virtual Clinic",
        blocks: [
          {
            type: "qa",
            question:
              "What is the difference between practicing telemedicine and running a virtual clinic?",
            answer:
              "Telemedicine typically refers to providing remote consultations on an individual or ad-hoc basis—using tools like video calls or phone consultations. In contrast, a virtual clinic is a fully integrated, branded digital practice. It comes with structured scheduling, automated workflows, ongoing client relationship management, and integrated billing systems. Essentially, while telemedicine is a mode of delivering care, a virtual clinic is a complete business model designed to scale and enhance your remote practice.",
            example:
              "For example, if you simply offer remote consults via Zoom, that’s basic telemedicine. However, if you have your own branded platform with personalized scheduling, client records, and automated reminders, you're operating a virtual clinic.",
            helpText:
              "By building a virtual clinic with Vetcation, you not only provide remote care but also create a sustainable, scalable practice that maximizes earnings and deepens client relationships.",
          },
        ],
      },
      {
        id: "legalCompliance",
        title: "Legal Compliance",
        blocks: [
          {
            type: "qa",
            question:
              "Are telehealth-only locations exempt from premises registration in California?",
            answer:
              "Under California law, a telehealth-only location (like your home office) is exempt from premises registration if you do not conduct in-person exams, do not store or dispense medications, and securely maintain medical records. (BPC, § 4853(h).) Vetcation’s platform is designed to help you create a virtual clinic that meets these requirements.",
          },
        ],
      },

      {
        id: "updateLegalProfile",
        title: "Update Legal Profile",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Legal first and last name",
                lines: [
                  "Make sure this matches your California license records.",
                ],
              },
              {
                heading: "Phone number",
                lines: [
                  "Used for secure pharmacy contact and client support if needed.",
                ],
              },
              {
                heading: "Address",
                lines: [
                  "List your legal business address. This can be your home if you do not conduct in-person exams.",
                ],
              },
              {
                heading: "Licenses",
                lines: [
                  "Upload a current California veterinary license. Ensure expiration dates are accurate.",
                ],
              },
              {
                heading: "Your signature",
                lines: [
                  "Provide a digital signature to appear on records and prescriptions, where required.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8359.PNG?alt=media&token=e9c21e33-85ba-4bb6-9ac9-5354259e197b",
            ],
          },
        ],
      },
      // NEW FRAMED IMAGE BLOCK:

      {
        id: "updatePublicProfile",
        title: "Update Public Profile",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "About me",
                lines: [
                  "Write a short, friendly introduction to help pet owners get to know you.",
                ],
              },
              {
                heading: "Which animals can you treat",
                lines: [
                  "Specify if you treat dogs, cats, exotics, livestock, etc.",
                ],
              },
              {
                heading: "Languages",
                lines: [
                  "List any languages you speak to make care accessible to diverse pet owners.",
                ],
              },
              {
                heading: "Specialized in",
                lines: [
                  "Mention any specialties such as dermatology, behavior, nutrition, etc.",
                ],
              },
              {
                heading: "Interested in",
                lines: [
                  "Optional: Share your clinical interests to help match with ideal cases.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8360.PNG?alt=media&token=deec5ee2-d232-488e-a8c1-e8dd9d953677",
            ],
          },
        ],
      },
      {
        id: "setRate",
        title: "Set Rate",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Choose your consultation rate",
                lines: [
                  "Set the price clients will pay for each virtual visit.",
                ],
              },
              {
                heading: "Stay competitive",
                lines: [
                  "Vetcation can provide benchmarks to help you find the sweet spot for pricing.",
                ],
              },
              {
                heading: "Change anytime",
                lines: [
                  "You can update your rate anytime through your dashboard.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8361.PNG?alt=media&token=b40f0ccd-b0f5-4b3f-b7f6-de905f6cd258",
            ],
          },
        ],
      },
      {
        id: "setMinimumNotice",
        title: "Set Minimum Notice Time",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Define how far in advance clients can book",
                lines: [
                  "Choose a minimum notice period to help manage your time effectively—e.g., 1 hour, 24 hours, etc.",
                ],
              },
              {
                heading: "Balance flexibility and control",
                lines: [
                  "Shorter notice = more spontaneous bookings. Longer notice = better planning.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_8347.PNG?alt=media&token=afa7a1d0-fd76-4c70-b9ff-603396f2d151",
            ],
          },
        ],
      },
      {
        id: "setAvailability",
        title: "Regular Availability",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Create a recurring weekly schedule",
                lines: [
                  "Block out hours when you are available to accept virtual appointments.",
                ],
              },
              {
                heading: "Update anytime",
                lines: [
                  "Modify your schedule as often as you like—daily, weekly, or seasonally.",
                ],
              },
              {
                heading: "Time zone aware",
                lines: [
                  "Our platform auto-adjusts for time zone differences so clients always see your availability correctly.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8350.PNG?alt=media&token=2e99b72f-ac39-437d-a63e-e396b877046b",
            ],
          },
        ],
      },
    ],
  },

  setMinimumNoticeTime: {
    // mainTitle: "Build Your Virtual Clinic with Vetcation",
    //     mainDescription: `Vetcation empowers California-licensed veterinarians to transform remote care into a complete digital practice.
    // Our platform goes beyond basic telemedicine by enabling you to build a branded virtual clinic—complete with secure recordkeeping,
    // automated scheduling, and client management—all while staying fully compliant with AB 1399. Learn the difference between telemedicine
    // and a virtual clinic, the legal Compliance, and follow simple steps to set up your own clinic from anywhere.`,
    sections: [
      {
        id: "setMinimumNotice",
        title: "Minimum Notice Time",
        blocks: [
          {
            type: "qa",
            question:
              "What is the minimum booking notice time, and why is it important for telemedicine appointments?",
            answer:
              "Minimum booking notice time is the shortest amount of advance notice you require from clients when scheduling telemedicine appointments. For example, you might set a minimum notice of 15 minutes, meaning clients must book at least 15 minutes ahead. Choosing a shorter minimum booking notice can significantly improve your visibility and ranking with potential clients, especially those who need acute care quickly. Many clients seek appointments within a 30-minute window, making your responsiveness and availability critical to attracting new clients. Selecting a minimum booking notice time that suits your schedule ensures you have adequate preparation time, while also optimizing your opportunity to assist clients promptly.",
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_8347.PNG?alt=media&token=afa7a1d0-fd76-4c70-b9ff-603396f2d151",
            ],
          },
        ],
      },
    ],
  },

  regularAvailability: {
    mainTitle: "Regular Availability",
    mainDescription: `Regular Availability puts you in control of your schedule. You can set the times you’re available for appointments, and the system will automatically generate 30-minute appointment slots for the next 30 days based on your preferences. Once your regular availability is set, the system will continuously maintain this 30-day window by creating new slots each day. Clients can instantly book available times, and any updates you make will immediately reflect in future open slots—no manual adjustments needed.`,

    sections: [
      {
        id: "regularAvailabilitySetup",
        title: "Regular Availability Setup",
        blocks: [
          {
            type: "qa",
            question: "How do I set my Regular Availability?",
            answer:
              "From your availability settings, you can customize your weekly schedule—Monday through Sunday. Choose one or more time slots per day and assign different rates as needed. It's flexible, and you're in charge.",
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8350.PNG?alt=media&token=2e99b72f-ac39-437d-a63e-e396b877046b",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8349.PNG?alt=media&token=6d3c449f-d68b-4dfe-b2fa-7dda67b00b63",
            ],
          },
          {
            type: "qa",
            question:
              "Will modifying Regular Availability affect existing appointments?",
            answer:
              "No. Any appointments already booked will remain in place, so you don’t have to worry about losing scheduled sessions.",
          },
          {
            type: "qa",
            question:
              "What if I want to offer availability only on specific days and times?",
            answer:
              "If you prefer a more targeted approach instead of a weekly routine, you can use the Specific Availability tool to open up time slots only when you choose.",
          },
          {
            type: "qa",
            question:
              "Will changing Regular Availability affect slots I created with the Specific Availability tool?",
            answer:
              "Not at all. The two tools work independently, so changes to your regular schedule won’t interfere with any specific time slots you’ve manually opened.",
          },
        ],
      },
    ],
  },

  specificAvailability: {
    mainTitle: "Specific Availability",
    mainDescription: `Specific Availability lets you open up time slots for appointments on an as-needed basis. You can create new slots for any day and time, even if it’s outside your regular availability. This tool is perfect for adding extra hours during busy periods, accommodating special requests, or adjusting your schedule for holidays or vacations. Specific Availability slots are visible to clients immediately, so they can book these times without delay.`,
    sections: [
      {
        id: "specificAvailabilitySetup",
        title: "Specific Availability Setup",
        blocks: [
          {
            type: "qa",
            question: "How do I set my Specific Availability?",
            answer:
              "From your availability settings, you can open up time slots for appointments on any day and time. These slots will be visible to clients right away, so they can book these times without delay. The default rate you set will apply to these specific slots.",
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8352.PNG?alt=media&token=b511733c-6ce5-4cf9-b5e3-a34ff585c6ab",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8353.PNG?alt=media&token=0ce77fe4-5fc6-467a-8edd-8dae91b231d0",
            ],
          },
        ],
      },
    ],
  },

  pauseAvailability: {
    mainTitle: "Pause Availability",
    mainDescription: `Pause Availability lets you temporarily hide your profile and stop new appointments from being booked. Whether you need an hour, a day, a week, or time off until a specific date, you can pause your availability quickly from this feature. This is perfect for handling last-minute conflicts, planned time off, or unexpected changes. Pausing only affects new bookings—any appointments already scheduled during the pause period will remain on your calendar and will not be canceled. The system will automatically reopen your schedule when the pause ends.`,

    sections: [
      {
        id: "pauseAvailabilitySetup",
        title: "Pause Availability Setup",
        blocks: [
          {
            type: "qa",
            question: "How do I reactive my availability after pausing it?",
            answer:
              "Once you’re ready to start accepting appointments again, you can reactivate your availability with just one click. The system will automatically update your profile and make your time slots visible to clients.",
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8356.PNG?alt=media&token=30ba526a-d3d5-45d3-9f93-f14a826ca625",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8357.PNG?alt=media&token=798a15a4-e683-416e-bcab-fff7b6edc45f",
            ],
          },
        ],
      },
    ],
  },

  mySchedule: {
    mainTitle: "Manage My Schedule",
    mainDescription: `My Schedule is your personal calendar that displays all your upcoming appointments in one place. You can view your schedule by day, week, or month, and easily manage your availability, appointments, and breaks. This feature helps you stay organized, plan your day effectively, and ensure you never miss a virtual consult. My Schedule is synced with your availability settings, so any changes you make will automatically update your calendar.`,

    sections: [
      {
        id: "myScheduleOverview",
        title: "My Schedule Overview",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "View all appointments at a glance:",
                lines: ["You can select any date to view the appointments."],
              },
              {
                heading: "booked appointments (grey):",
                lines: [
                  "the grey color indicates the appointment is already booked. It shows the patient's name, breed, and the symptoms.",
                ],
              },
              {
                heading: "Available slots (green):",
                lines: [
                  "The green color indicates the available slots for booking.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8363.PNG?alt=media&token=f9ab1141-b8e7-4050-9ae0-68cc533fb4a5",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8364.PNG?alt=media&token=bda8ae8f-b822-441c-83cd-f1e81063058e",
            ],
          },
          {
            type: "qa",
            question: "How do I view my upcoming appointments?",
            answer:
              "You can press any of the appointment in the calendar to view the details of the appointment.",
          },
          {
            type: "bulletList",
            items: [
              {
                heading: "Medical History:",
                lines: ["You can view the medical history of the patient."],
              },
              {
                heading: "Calendar:",
                lines: ["You can add the appointment to your calendar."],
              },
              {
                heading: "Join Call:",
                lines: ["You can join the synchronous call with the patient."],
              },
              {
                heading: "Cancel:",
                lines: [
                  "You can cancel the appointment. (see detail cancellation explanation in the next section)",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            // heading: "Sample: Updating Your Legal Profile",
            imageSrcs: [
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8366.PNG?alt=media&token=764e39fe-263f-4b6f-803e-946b2bd20c30",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
            ],
          },
        ],
      },
    ],
  },
  // Add this new entry for Bill1399:
  Bill1399: {
    mainTitle: "Assembly Bill 1399",
    mainDescription: `Assembly Bill (AB) 1399 (Friedman, Chapter 475, Statutes of 2023) took effect 
on January 1, 2024. This legislation sets out clear requirements for establishing a 
valid veterinarian-client-patient relationship (VCPR) before prescribing, dispensing, 
or administering any treatment for animal care. (Business and Professions Code (BPC), 
§ 4826.6.) AB 1399 also clarifies how veterinary telehealth may be provided under 
California law. (BPC, §§ 4825.1, 4826.6, 4829.5, and 4853.)

Below are frequently asked questions (FAQs) the Veterinary Medical Board (Board) has 
compiled in response to public inquiries about the new law. We’ve included notes on 
how Vetcation’s features help veterinary professionals comply with each requirement 
through our built-in workflows and technology tools. In the event of any differences 
between these FAQs and the statute itself, the statute is controlling, and the Board 
will enforce it accordingly. Veterinary professionals should review the official 
statutes in detail to ensure full compliance.`,
    sections: [
      {
        id: "faqOutOfState",
        title: "Out-of-state Telemedicine",
        blocks: [
          {
            type: "qa",
            question:
              "Can a California licensed veterinarian use telemedicine to establish or continue treatment within an existing VCPR if the animal patient is originally from California but is currently located outside of California?",
            answer:
              "No. Under AB 1399, for a California-licensed veterinarian to provide veterinary medical services via telehealth, the animal must be physically located in California. (BPC, § 4826.6, subd. (f).) However, authorizing a refill for an existing prescription (for an out-of-state pet) is not considered telehealth.",
            example:
              "If your long-time client and their pet travel to Oregon, you cannot initiate a new telemedicine consult while the pet is out of state. However, if the pet already has an active prescription on file, you can authorize a refill without it being classified as a “telehealth” service.",
            helpText:
              "Our platform automatically checks the patient's reported location at scheduling. If an out-of-state address is detected, Vetcation alerts you that a new telemedicine consult may not be permissible. For existing prescriptions, you can still process refills to maintain continuity of care without violating telehealth regulations.",
          },
        ],
      },
      {
        id: "faqRefillOutOfStatePharmacy",
        title: "Refilling Prescriptions at Out-of-State Pharmacies",
        blocks: [
          {
            type: "qa",
            question:
              "Can a California-licensed veterinarian authorize a prescription refill to an out-of-state pharmacy if the animal patient is currently located outside of California?",
            answer:
              "Yes. Under AB 1399, while a California-licensed veterinarian cannot initiate a new telemedicine consult for an animal patient located outside of California, they may authorize a refill for an existing prescription. This authorization can be directed to a pharmacy in the state where the animal is currently located. (BPC, § 4826.6, subd. (f).)",
            example:
              "If your client and their pet are traveling in Oregon and require a refill of an existing prescription, you can authorize the refill and direct it to a local pharmacy in Oregon. This action is permissible and does not constitute telehealth under California law.",
            helpText:
              "Vetcation facilitates the authorization of prescription refills to out-of-state pharmacies for existing prescriptions. Our platform ensures that such actions comply with AB 1399 by verifying the existence of a valid VCPR and restricting new telemedicine consults when the animal patient is out of state.",
          },
        ],
      },
      {
        id: "faqSameDiagnosisNewMed",
        title:
          "New Medications for the Same Diagnosis While Pet Is Out of State",
        blocks: [
          {
            type: "qa",
            question:
              "Can a California-licensed veterinarian prescribe a new medication for the same diagnosis if the animal is currently out of state?",
            answer:
              "No. Under AB 1399, prescribing any new medication while the animal is physically outside of California is considered telehealth and is not permitted—even if the diagnosis (such as gastroenteritis) was previously established. The only exception is authorizing a refill of an existing prescription. Initiating a new treatment plan, even under the same diagnosis, is not allowed if the animal is not in California.",
            example:
              "If a dog was diagnosed with gastroenteritis during an in-state visit and was prescribed anti-nausea medication for vomiting, but later develops diarrhea while in another state, the vet cannot prescribe a new anti-diarrheal unless it was already included as a PRN medication during the original consult.",
            helpText:
              "Vetcation supports responsible use of PRN medications during the original in-state consult by allowing vets to proactively prescribe treatments for anticipated symptoms under a single diagnosis. However, if the pet is out of state and needs a new medication not already covered in the original care plan, our platform restricts new prescriptions to ensure compliance with AB 1399.",
          },
        ],
      },
      {
        id: "faqConfirmLocation",
        title: "Confirming Location",
        blocks: [
          {
            type: "qa",
            question:
              "Does the client providing a California address suffice to satisfy the requirement that the animal patient is located in this state?",
            answer:
              "No. It is recommended the veterinarian confirm with the client that the animal patient is physically in California at the time telehealth services are provided. (BPC, § 4826.6, subd. (f).)",
            example:
              "A client might list a California home address but could be traveling with their pet in Nevada. In this scenario, you cannot initiate a new telemedicine consult under California law because the pet is physically out of state.",
            helpText:
              "Our platform prompts the client to confirm their current location at the start of each telehealth appointment. If the address is outside California, Vetcation alerts you that proceeding with a new telemedicine consult may not be permissible. This ensures you remain compliant with AB 1399 while still allowing you to manage refills or follow-up actions for existing prescriptions.",
          },
        ],
      },
      {
        id: "faqVetOutOfState",
        title: "Veterinarian Location",
        blocks: [
          {
            type: "qa",
            question:
              "Can a California-licensed veterinarian provide telemedicine if they are physically located outside of California?",
            answer:
              "Yes. Under AB 1399, veterinary telehealth is legally considered to occur at the location of the animal patient—not the veterinarian. As long as the animal is physically in California at the time of the telemedicine consult, a California-licensed veterinarian may practice via telehealth even if they are located outside of California or outside the United States.",
            example:
              "If you are a California-licensed veterinarian traveling in New York or abroad and a pet located in California needs a telemedicine consult, you may provide care as long as a valid VCPR is established and all requirements of AB 1399 are followed.",
            helpText:
              "Vetcation allows licensed California veterinarians to log in and offer virtual care from anywhere. Our system ensures telehealth consults can only be initiated when the animal is reported to be in California, helping you stay compliant with the law while maintaining flexibility in how and where you practice.",
          },
        ],
      },
      {
        id: "faqPrescriptionNotice",
        title: "Posting Prescription Availability",
        blocks: [
          {
            type: "qa",
            question:
              "Can the veterinarian notify the client that “some prescription drugs or medications may be available at a pharmacy” by posting a notice in a virtual lobby?",
            answer:
              "Yes. The requirement is to provide notice to the client that some prescription drugs or medications may be available at a pharmacy, but there is no specific method prescribed for doing so. (BPC, § 4826.6, subd. (i)(7).) However, the prescribing veterinarian must still comply with all statutes and regulations in the Veterinary Medicine Practice Act and Pharmacy Law. This includes, but is not limited to, prescriber dispensing requirements listed in BPC section 4170.",
            example:
              'You could display a banner in your virtual meeting room that reads: "Certain medications may be available at a pharmacy." As long as clients see this notice before or during the telehealth visit, you have met the requirement.',
            helpText:
              "Our platform will show the banner on the appointment card, automatically displaying it to all clients prior to the consultation. This ensures compliance with AB 1399 and helps track user acknowledgment of the notice in your records.",
          },
        ],
      },
      {
        id: "faqOnePosting",
        title: "Combining Disclosures",
        blocks: [
          {
            type: "qa",
            question:
              "If the prescription notice can be posted in the lobby, can it be incorporated into the existing notice requirement so that both disclosures are in one posting?",
            answer:
              "Yes. Both disclosures can be combined into a single posting, since the law does not require them to be displayed separately. Consolidating them ensures clients see all relevant information in one place, reducing confusion and improving compliance.",
            example: "",
            helpText:
              'Our platform has helped you create a combined notice that includes important telemedicine disclaimers, such as pharmacy availability, professional standards (telemedicine follows the same regulations as in-person care), and emergency guidance (e.g., "Emergencies cannot be treated via telehealth"). All of these appear on the appointment card so clients see them before the telemedicine session begins. Vetcation also tracks user acknowledgment, giving you a record that they’ve viewed the notice.',
          },
        ],
      },
      {
        id: "faqPharmacyChoice",
        title: "Pharmacy Choice Disclosure",
        blocks: [
          {
            type: "qa",
            question:
              "Since AB 1399 only requires veterinarians to notify the client that “some prescription drugs or medications may be available at a pharmacy,” does the veterinarian have to notify the client that the veterinarian can submit a prescription to the pharmacy of the client’s choice?",
            answer:
              "Yes. The veterinarian must provide the client with a written disclosure that the client may obtain the prescription either from the veterinarian or from a pharmacy of the client’s choice. (BPC, § 4170, subd. (a)(7).) Furthermore, before prescribing, the veterinarian must offer to provide a written prescription that the client may choose to have filled by the prescriber or by any pharmacy. (BPC, § 4170, subd. (a)(6).)",
            example: "",
            helpText:
              "Our platform allows clients to select their preferred pharmacy—whether a physical location like Costco, Walmart, or CVS, or an online pharmacy such as Mixlab or Chewy. Vets can confirm the client’s choice directly in the Vetcation interface before finalizing a prescription, ensuring compliance with AB 1399 and other state regulations.",
          },
        ],
      },
      {
        id: "faqPrivacyLaws",
        title: "Privacy and Confidentiality",
        blocks: [
          {
            type: "qa",
            question:
              "What are the privacy protection laws with which a veterinarian practicing veterinary medicine via telehealth must comply?",
            answer:
              "Under California law (BPC section 4857), veterinarians must maintain the confidentiality of all client and patient information, just as they would for in-person care. If a veterinarian negligently releases this information, they could face a civil lawsuit (outside of the Veterinary Medical Board’s jurisdiction). In other words, even though the Board may not prosecute you for a privacy breach, a client could sue you in civil court for mishandling confidential data. That’s why it’s crucial to understand and follow privacy laws that apply to veterinary practice, both in person and via telehealth.",
            example: "",
            helpText:
              "Our platform is designed with secure data handling and encrypted communication to protect confidential information during telehealth sessions. Vetcation also provides access controls so that only authorized users can view client records, reducing the risk of accidental disclosure. We recommend veterinarians familiarize themselves with all relevant privacy regulations and use best practices—such as password protection, secure networks, and careful record-sharing protocols—to minimize liability.",
          },
        ],
      },
      {
        id: "faqMedicalHistory",
        title: "Obtaining Relevant Medical History",
        blocks: [
          {
            type: "qa",
            question:
              "If the client does not provide the veterinarian with the animal patient’s relevant medical history or medical records, can the veterinarian provide veterinary telehealth for the animal patient?",
            answer:
              "Telehealth cannot be used if the veterinarian does not obtain and review the relevant medical history for the animal. However, actual medical records are not strictly required—if the client can relay the pet’s relevant history verbally or via written form, that may suffice. If official medical records are available, the veterinarian must obtain and review them before proceeding. (BPC, § 4826.6, subd. (h)(2).)",
            example: "",
            helpText:
              "Our platform prompts the client to provide a thorough history of the animal’s condition before the telehealth appointment. If past records exist, we encourage clients to upload them. This ensures the veterinarian has enough background information to make an informed assessment, keeping the telehealth process compliant with AB 1399 and other state regulations.",
          },
        ],
      },
      {
        id: "faqLocalResources",
        title: "Local Medical Resources Familiarity",
        blocks: [
          {
            type: "qa",
            question:
              "How will the Board verify that the veterinarian providing telehealth was familiar with available medical resources, including emergency resources, near the animal patient’s location?",
            answer:
              "If the Board inquires whether you were familiar with the medical resources available near the patient’s location (including emergency care), you must be able to explain your familiarity and, if necessary, submit documentation that supports your claim. (BPC, § 4826.6, subd. (h)(4).) This might involve showing references or notes about nearby emergency clinics, urgent care facilities, or specialized hospitals within the pet’s region.",
            example: "",
            helpText:
              "Our platform allows veterinarians to document local emergency contact information in the patient’s file. You can log the name, address, and phone number of nearby clinics or hospitals, ensuring you have a record of your due diligence. If the Board requests validation, you can easily provide evidence of your familiarity with local resources, demonstrating compliance with AB 1399.",
          },
        ],
      },
      {
        id: "faqMidwayInterruption",
        title: "Mid-Appointment Interruption",
        blocks: [
          {
            type: "qa",
            question:
              "If midway through an appointment the synchronous audio-visual communication is interrupted, can a VCPR be established solely by another form of electronic communication?",
            answer:
              "No. To establish a valid VCPR via telehealth, the veterinarian must gain sufficient knowledge of the animal patient by examining the patient using synchronous audio-video communication. (BPC, § 4826.6, subd. (b)(2).) Once a VCPR is established, ongoing care may continue via other telehealth methods, unless the veterinarian determines that synchronous audio-video is necessary for proper treatment. (BPC, § 4826.6, subd. (d).)",
            example: "",
            helpText:
              "Our platform prioritizes a stable audio-video connection, allowing vets to meet the synchronous requirement. If a technical interruption occurs, Vetcation enables quick reconnection or rescheduling so that you can complete the real-time exam. Once the VCPR is established, Vetcation also supports asynchronous follow-ups, letting you and the client communicate through chat or messaging if that meets the standard of care.",
          },
        ],
      },
      {
        id: "faqAntimicrobialDefinition",
        title: "Definition of 'Antimicrobial'",
        blocks: [
          {
            type: "qa",
            question:
              "Which definition of “antimicrobial” will the Board use to enforce the antimicrobial prescription by telehealth provision?",
            answer:
              "The Board will follow the definition provided in Appendix A of the federal Food and Drug Administration’s Guidance for Industry #152. This includes “critically important,” “highly important,” and “important” antimicrobial drugs, as Appendix A may be amended over time.",
            example: "",
            helpText:
              "Our platform flags prescriptions that fall under these categories, ensuring veterinarians recognize when an antimicrobial is being prescribed. We also offer quick reference links to the FDA’s updated lists, so you can confirm a drug’s classification before finalizing a telehealth prescription.",
          },
        ],
      },
      {
        id: "faqRacehorsePrescribing",
        title: "Prescribing for Racehorses via Telehealth",
        blocks: [
          {
            type: "qa",
            question:
              "If a veterinarian prescribes medication via telehealth unknowingly to a racehorse or to a trainer registered with the California Horse Racing Board (CHRB), what documentation would the Board require to show that the vet was unaware of these circumstances?",
            answer:
              "Before prescribing any drug or medication via telehealth, the veterinarian must confirm with the client that the horse is not engaged in racing or training at a facility under CHRB jurisdiction. If the horse is engaged in racing or training under the CHRB, telehealth prescribing is prohibited. (BPC, § 4826.6, subd. (i)(8).) The veterinarian’s lack of knowledge is not considered a defense if the horse is later found to be racing or training. Therefore, you should document your inquiry and the client’s response in the medical record to demonstrate due diligence in verifying the horse’s status.",
            example: "",
            helpText:
              "Our platform includes a pre-consultation form where clients must disclose whether the horse is involved in racing or training under the CHRB. Vetcation automatically stores this information in the patient’s record, providing written proof that the veterinarian asked—and the client answered—before issuing any telehealth prescriptions.",
          },
        ],
      },
      {
        id: "faqChangeDosage",
        title: "Changing Dosage for Racehorses via Telehealth",
        blocks: [
          {
            type: "qa",
            question:
              "Can a veterinarian via telehealth change the dosage of a previously prescribed drug or medication for a horse engaged in racing or training at a facility under the jurisdiction of the California Horse Racing Board (CHRB)?",
            answer:
              "No. Any change to a previously prescribed drug or medication is treated as a new prescription and cannot be issued via telehealth for a horse engaged in racing or training under CHRB jurisdiction. (BPC, § 4826.6, subd. (i)(8).)",
            example: "",
            helpText:
              "Vetcation automatically prompts veterinarians to confirm the horse’s racing status before modifying any prescription. If the horse is under CHRB jurisdiction, the system will flag the dosage change as prohibited for telehealth, helping you avoid regulatory violations.",
          },
        ],
      },
      {
        id: "faqRemoteExamAssistant",
        title: "Remote Examination with a Veterinary Assistant",
        blocks: [
          {
            type: "qa",
            question:
              "If a veterinary assistant and client are in a room located within a registered veterinary premises, can a veterinarian remotely perform an examination and ask the veterinary assistant to perform diagnostic tests as needed?",
            answer:
              "Yes. If the veterinarian determines that a VCPR can be established via telehealth, a veterinary assistant may carry out certain diagnostic tests under the veterinarian’s indirect supervision. However, the assistant cannot obtain or administer anesthesia or controlled substances for these tests. (BPC, § 4836.1.) Additionally, any use of radiographic equipment must be performed by an individual trained in radiation safety and techniques, under the direct supervision of a registered veterinary technician (RVT) or licensed veterinarian. (BPC, § 4840.7, subd. (b).)",
            example: "",
            helpText:
              "Our platform supports real-time video oversight, enabling the veterinarian to guide the assistant’s tasks remotely. Vetcation also logs each procedure, ensuring compliance with supervision requirements. If radiographs or other specialized diagnostics are needed, the system can prompt for an RVT or licensed vet to be present, helping you maintain compliance with California law.",
          },
        ],
      },
      {
        id: "faqAssistantVaccinations",
        title: "Vaccinations by Veterinary Assistant via Telemedicine",
        blocks: [
          {
            type: "qa",
            question:
              "Can a veterinary assistant give vaccinations under the direct supervision of the remote veterinarian performing the telemedicine examination?",
            answer:
              "No, because “direct supervision” requires the supervisor to be physically present and quickly available at the location where the tasks are performed. (CCR, tit. 16, § 2034, subd. (e).) A veterinarian providing a telemedicine exam is not physically on-site, so that supervision is considered “indirect.” If the prescribed vaccine is not a controlled substance or a restricted dangerous drug, a veterinary assistant may administer it at a registered veterinary premises under indirect supervision of the veterinarian, or under direct supervision of an RVT physically present. (BPC, § 4836.1, subds. (a), (b); CCR, tit. 16, §§ 2034, subd. (f), 2036.5, subd. (b).)",
            example: "",
            helpText:
              "Our platform documents each step of the telemedicine visit, clarifying when the veterinarian is providing indirect supervision. It also prompts you to confirm whether an RVT is physically present for tasks requiring direct supervision. This ensures everyone’s role is clear and meets California’s legal requirements for administering vaccines.",
          },
        ],
      },
    ],
  },

  // ====== NEW VCPR SECTION ======
  VCPR: {
    mainTitle: "Veterinarian-Client-Patient Relationship (VCPR)",
    mainDescription: `A valid VCPR is the cornerstone of providing veterinary care, whether 
in-person or via telehealth. California law (BPC, § 4826.6) allows three primary methods 
to establish a VCPR: (1) synchronous audio-video examination, (2) in-person examination 
of the animal, or (3) making medically appropriate and timely visits to the premises 
where the animal is kept. Below are FAQs explaining each method, plus general info 
on what a VCPR entails and how Vetcation helps you remain compliant.`,
    sections: [
      {
        id: "definingVCPR",
        title: "Defining VCPR",
        blocks: [
          {
            type: "qa",
            question:
              "What exactly is a Veterinarian-Client-Patient Relationship (VCPR)?",
            answer:
              "A VCPR exists when a veterinarian takes responsibility for making medical judgments regarding an animal patient, and the client agrees to follow the vet’s instructions. The veterinarian must be sufficiently familiar with the animal’s condition (via in-person exam, synchronous audio-video exam, or timely premises visits), and must communicate a treatment or diagnostic plan to the client. (BPC, § 4826.6, subds. (a), (b).)",
            example:
              "If you have recently examined the animal—either in person or by a live video consult—and discussed a treatment plan with the client, you’ve established a VCPR, provided the client has consented to your guidance.",
            helpText:
              "Vetcation logs each exam (in-person or video), ensuring you have a clear record of how and when the VCPR was formed. This audit trail demonstrates compliance if questions arise.",
          },
        ],
      },
      {
        id: "faqSynchronousAV",
        title: "Synchronous Audio-Video Examination",
        blocks: [
          {
            type: "qa",
            question:
              "How does a synchronous audio-video exam establish a VCPR?",
            answer:
              "Under AB 1399, a veterinarian may establish a valid VCPR by examining the animal patient in real time using two-way audio-video communication. This allows the vet to visually assess the animal’s condition, just as they would in person, and form a preliminary diagnosis or treatment plan. (BPC, § 4826.6, subds. (b)(2).)",
            example:
              "A client schedules a live video call through Vetcation. You observe the pet’s physical condition, movement, or visible symptoms via the camera, and discuss the pet’s history and environment. After the session, you have enough information to advise on treatment.",
            helpText:
              "We provide a stable video platform that records the date and duration of each live session, prompting you to document findings in the patient’s record. This ensures proof that the exam was truly synchronous audio-video and meets the legal standard.",
          },
        ],
      },
      {
        id: "faqInPersonExam",
        title: "In-Person Examination",
        blocks: [
          {
            type: "qa",
            question:
              "How does an in-person examination factor into establishing a VCPR?",
            answer:
              "In-person exams remain the traditional method for forming a VCPR. You physically examine the animal at your clinic or a registered veterinary premises. If you’ve recently examined the animal in person, you can continue providing telehealth services based on that in-person VCPR for up to a certain duration, depending on the type of drug or treatment needed. (BPC, § 4826.6, subds. (b)(1).)",
            example:
              "A client brings their cat to your clinic for an annual checkup. Two weeks later, the cat develops new symptoms. You can conduct a telemedicine consult because you’ve already established a VCPR in person.",
            helpText:
              "Our system tracks in-person visits and syncs them to the patient’s record. This way, if you switch to telehealth later, Vetcation recognizes that a valid VCPR already exists and won’t block you from prescribing or advising the client (within legal time limits).",
          },
        ],
      },
      {
        id: "faqPremisesVisit",
        title: "Premises Visits",
        blocks: [
          {
            type: "qa",
            question:
              "What is a premises visit, and how does it establish a VCPR?",
            answer:
              "A premises visit means you go to the location where the animal is kept (e.g., a client’s home, ranch, farm, or stable) to evaluate the patient. This direct observation of the animal’s condition and environment is legally recognized as a valid way to establish a VCPR. (BPC, § 4826.6, subd. (b)(3).)",
            example:
              "You regularly visit a farm to check on a herd of goats. Because you’ve observed them on-site, you can later offer telemedicine consults for those goats without needing another in-person exam—so long as your premises visits are considered medically appropriate and timely.",
            helpText:
              "Our platform stores documentation of each premises visit. When you do a follow-up video consult, Vetcation sees that you’ve already established a valid VCPR through an on-site exam, ensuring compliance with California law.",
          },
        ],
      },
      // ...Add more FAQs about VCPR as needed...
    ],
  },

  PrescriptionLimits: {
    mainTitle: "Prescription Time Limits under AB 1399",
    mainDescription: `Once a valid VCPR is established—whether in person or via telehealth—there are 
important time limits on how long you can continue prescribing medications before 
another exam is required. California’s AB 1399 (BPC, § 4826.6) and related statutes 
lay out different rules depending on the type of exam and the type of drug. Below 
are some FAQs to clarify these limits and how Vetcation helps you stay compliant.`,
    sections: [
      {
        id: "faqGeneralOverview",
        title: "General Overview",
        blocks: [
          {
            type: "qa",
            question:
              "Why do different prescription time limits apply, depending on how the VCPR was established?",
            answer:
              "California law distinguishes between an in-person exam and a telehealth-based exam. If you establish the VCPR in person, you can typically prescribe for up to one year. But if you establish it via synchronous audio-video, you can only prescribe for up to six months for most drugs, and only up to 14 days for antimicrobials. (BPC, § 4826.6, subds. (i)(2)–(5).)",
            example:
              "You examine a dog in person at your clinic. Six months later, the dog needs a refill on its heart medication. Because you established the VCPR in person, you can still legally prescribe without another exam—assuming you haven’t exceeded one year since the last in-person visit.",
            helpText:
              "Our platform checks the date and method of the last exam. If you try to prescribe beyond the legal time limit, Vetcation will flag it or block it, helping you avoid noncompliance.",
          },
        ],
      },
      {
        id: "faqOneYearLimit",
        title: "1-Year Limit After In-Person Exam",
        blocks: [
          {
            type: "qa",
            question:
              "If I established the VCPR by examining the animal in person, how long can I prescribe medications?",
            answer:
              "You can prescribe for up to one year from the date you last examined the patient in person. After one year, you must conduct another exam (either in person or via telehealth, depending on the drug type) before continuing to prescribe. (BPC, § 4826.6, subd. (i)(2).)",
            example:
              "You see a cat in person on January 1, 2025. You can legally prescribe medication until January 1, 2026, without needing a new exam—unless it’s a controlled substance or other restricted category that requires more frequent checks.",
            helpText:
              "We track the date of your last in-person exam and automatically notify you as you approach the one-year mark, ensuring you don’t inadvertently prescribe beyond the allowed duration.",
          },
        ],
      },
      {
        id: "faqSixMonthLimit",
        title: "6-Month Limit After Synchronous Audio-Video Exam",
        blocks: [
          {
            type: "qa",
            question:
              "What if I established the VCPR using a synchronous audio-video exam? How long can I prescribe then?",
            answer:
              "If the VCPR was formed solely via live video (no prior in-person exam), you may only prescribe most drugs for up to six months from the date of that exam. After six months, you need another exam—either another video consult or an in-person exam—before continuing to prescribe. (BPC, § 4826.6, subd. (i)(4).)",
            example:
              "On February 1, 2025, you conduct a video consult for a dog’s skin condition and prescribe a topical medication. By August 1, 2025, you must re-examine the dog (via video or in person) if they need more medication.",
            helpText:
              "Vetcation automatically calculates the six-month window from the video exam date. When a refill request arrives, our system checks if you’re still within the valid timeframe. If not, it reminds you to conduct another exam first.",
          },
        ],
      },
      {
        id: "faqFourteenDayLimit",
        title: "14-Day Limit for Antimicrobials",
        blocks: [
          {
            type: "qa",
            question:
              "Is it true that antibiotics (and other antimicrobials) are limited to 14 days if the VCPR is established via telehealth?",
            answer:
              "Yes. If you established the VCPR using synchronous audio-video, you can only prescribe an antimicrobial drug for up to 14 days of treatment. Any refill or extension beyond 14 days requires an in-person exam. (BPC, § 4826.6, subd. (i)(5).)",
            example:
              "You diagnose a dog with a skin infection via video consult and prescribe a 10-day course of antibiotics. If the dog needs more than 10 days total, you can extend up to 14 days. But if the condition isn’t resolved by then, you must see the dog in person before prescribing more antibiotics.",
            helpText:
              "We tag certain medications as 'antimicrobials' in our drug database. If you attempt to prescribe beyond 14 days of treatment via telehealth-only VCPR, the system will block it and prompt you to schedule an in-person follow-up.",
          },
        ],
      },
      {
        id: "faqControlledSubstances",
        title: "Controlled Substances, Xylazine, and Racehorses",
        blocks: [
          {
            type: "qa",
            question:
              "Are there additional restrictions on controlled substances, xylazine, or prescriptions for racehorses?",
            answer:
              "Yes. If you have not performed an in-person exam, California law prohibits prescribing controlled substances or xylazine via telehealth. Also, you cannot prescribe any drug via telehealth for a horse engaged in racing or training at a CHRB-regulated facility. (BPC, § 4826.6, subds. (i)(6), (i)(8).)",
            example:
              "A trainer of a racehorse calls you for a telehealth consult. Because the horse is in training at a CHRB facility, you’re not allowed to prescribe any medication via telehealth. Similarly, if a cat needs a controlled pain medication, you must have performed an in-person exam first.",
            helpText:
              "We flag attempts to prescribe controlled substances or xylazine if the patient’s record only shows a telehealth exam. We also prompt the user to confirm if the horse is under CHRB jurisdiction, blocking telehealth prescriptions if it is.",
          },
        ],
      },
    ],
  },

  PrivacyConfidentiality: {
    mainTitle: "Privacy & Confidentiality in Telemedicine",
    mainDescription: `Under California law, veterinarians must ensure the privacy and confidentiality 
of all client and patient information, whether in-person or via telehealth. 
Business & Professions Code (BPC) § 4826.6(h)(1) requires secure technology for 
telehealth services, while BPC § 4857 addresses the release of confidential records 
and potential civil liability for negligence. The FAQs below clarify these obligations 
and explain how Vetcation helps you comply.`,
    sections: [
      {
        id: "faqPrivacyOverview",
        title: "General Privacy Requirements",
        blocks: [
          {
            type: "qa",
            question:
              "What are the main privacy rules for telemedicine under AB 1399?",
            answer:
              "Under BPC § 4826.6(h)(1), veterinarians must use technology and methods that protect confidential client and patient information during telehealth. Additionally, you must follow the same privacy and recordkeeping standards that apply to in-person care. If medical records exist, you must maintain their confidentiality and ensure they’re only accessed by authorized personnel. (BPC § 4857.)",
            example:
              "If you store telemedicine session videos or chat logs, you must keep them secure—just like paper records in a physical clinic. This means using encrypted storage, limiting who can view them, and retaining them for the legally required duration.",
            helpText:
              "Our platform uses end-to-end encryption for live video sessions and secure data storage for patient records. Only the assigned veterinarian and authorized team members can access these files, reducing the risk of accidental disclosure.",
          },
        ],
      },
      {
        id: "faqCivilLiability",
        title: "Civil Liability for Negligent Release",
        blocks: [
          {
            type: "qa",
            question:
              "What happens if a veterinarian accidentally discloses confidential information from a telemedicine session?",
            answer:
              "BPC § 4857 states that a veterinarian can face civil liability for the negligent release of confidential information, in addition to any potential disciplinary action. This means a client could sue you in civil court for damages if their data was mishandled. The Veterinary Medical Board may not prosecute a privacy breach directly, but a civil suit could still be brought against you if you fail to safeguard client or patient information.",
            example:
              "If a veterinarian’s unsecured laptop is stolen, revealing telemedicine session notes or client addresses, the vet could face a lawsuit if it’s proven they did not take reasonable steps to protect that data.",
            helpText:
              "We implement role-based access controls, meaning only verified staff can view sensitive records. Vetcation also provides secure sign-in and logs all user activity. This helps you prove you took proper precautions if a dispute arises.",
          },
        ],
      },
      {
        id: "faqAIProcessing",
        title: "AI-Assisted Medical Records & Appointment Summaries",
        blocks: [
          {
            type: "qa",
            question:
              "How does using AI to process audio or video from telemedicine sessions affect privacy and confidentiality, especially if the platform also generates an appointment summary for the client?",
            answer:
              "Any AI feature that processes telemedicine audio or video must comply with the same confidentiality requirements as traditional recordkeeping. This includes creating both the official medical record (for the veterinarian) and a shareable appointment summary (for the client). You should obtain informed consent from both the client and any participating veterinary staff before capturing or processing any recordings. While California law does not prohibit AI usage, the veterinarian is still responsible for ensuring the data is stored securely, access is restricted to authorized personnel, and no unauthorized disclosures occur. (BPC §§ 4826.6(h)(1), 4857.)",
            example:
              "If you plan to record the audio from a live consult and use AI to generate a medical record, you must notify the client that their session is being recorded and processed. If they decline, you cannot record or process their session. Consent is essential, and all data must remain encrypted and access-controlled.",
            helpText:
              "Our AI operates on secure, internal servers—no third-party cloud providers. We encrypt audio files and transcripts, then generate two separate documents: (1) a detailed medical record for the veterinarian’s files, and (2) a concise appointment summary for the client’s portal. Before the AI feature is enabled, Vetcation prompts you to confirm that the client has agreed to have their session recorded and processed, preventing any inadvertent privacy violations.",
          },
        ],
      },
      // ...Add more FAQs if needed...
    ],
  },

  RacehorseCHRBRestrictions: {
    mainTitle: "Racehorse / CHRB Restrictions",
    mainDescription: `California law places special restrictions on prescribing 
drugs for horses engaged in racing or training at facilities under the jurisdiction 
of the California Horse Racing Board (CHRB). (BPC, § 4826.6, subd. (i)(8).) Veterinarians 
providing telehealth services must confirm the horse’s status before prescribing 
any medication, as ignorance of the horse’s racing or training activities is 
not considered a valid defense.`,
    sections: [
      {
        id: "faqCHRBNoTeleRx",
        title: "No Telehealth Prescriptions for Racehorses",
        blocks: [
          {
            type: "qa",
            question:
              "Can a veterinarian prescribe medication via telehealth for a horse engaged in racing or training at a CHRB-regulated facility?",
            answer:
              "No. Under AB 1399 (BPC, § 4826.6, subd. (i)(8)), a veterinarian is prohibited from prescribing any drug or medication via telehealth if the horse is actively racing or training at a CHRB facility. This restriction applies even if you have an established VCPR through synchronous audio-video. An in-person examination is required for any prescription in these cases.",
            example:
              "A trainer requests medication for a racehorse that races at Santa Anita Park. If the horse is currently in training at that CHRB-regulated track, you cannot lawfully prescribe via telemedicine. Instead, you must see the horse in person before prescribing any medication.",
            helpText:
              "Our platform prompts you to confirm the horse’s racing status at the start of a telehealth consult. If the client indicates the horse is under CHRB jurisdiction, Vetcation automatically blocks new telehealth prescriptions and advises an in-person exam.",
          },
        ],
      },
      {
        id: "faqCHRBUnknownStatus",
        title: "Verifying the Horse’s Status",
        blocks: [
          {
            type: "qa",
            question:
              "What if a veterinarian unknowingly prescribes medication via telehealth to a horse that is racing or training under the CHRB?",
            answer:
              "The law states that the veterinarian’s lack of knowledge is irrelevant if the horse is later found to be racing or training. You must confirm the horse’s status before prescribing. (BPC, § 4826.6, subd. (i)(8).) If you fail to do so, you could be found in violation of AB 1399 even if you were unaware of the horse’s actual training or racing activities.",
            example:
              "A client might not mention the horse’s status, or they may provide incomplete information. If you do not document your inquiry and they’re later discovered to be at a CHRB facility, you may face penalties for unlawful telehealth prescribing.",
            helpText:
              "We require the client to disclose whether the horse is involved in CHRB-regulated racing or training. This Q&A is recorded in the patient file, providing proof that you verified the horse’s status. If the client answers 'yes,' Vetcation prevents you from issuing a telehealth prescription, helping you avoid regulatory violations.",
          },
        ],
      },
    ],
  },
  RecordKeepingDocumentation: {
    mainTitle: "Record Keeping & Documentation",
    mainDescription: `In California, veterinarians must maintain comprehensive records of each 
animal patient for a minimum period, ensure those records are kept confidential, 
and provide copies to clients upon request. (BPC §§ 4855, 4856.) The FAQs below 
clarify these obligations and highlight how Vetcation helps you stay organized 
and compliant, both for in-person visits and telehealth consultations.`,
    sections: [
      {
        id: "faqBasicRetention",
        title: "Basic Retention Requirements",
        blocks: [
          {
            type: "qa",
            question:
              "How long must I keep medical records for my veterinary patients?",
            answer:
              "Under California law, you must maintain medical records for each animal patient for at least three years. (BPC § 4856.) These records must include identification of the animal, relevant clinical information, diagnostic tests performed, treatments administered or prescribed, and any pertinent communication with the client.",
            example:
              "If you treat a dog in January 2025, you need to retain the medical records until at least January 2028, even if the client moves away or no longer seeks services.",
            helpText:
              "Our platform automatically stores and timestamps all telehealth session notes, diagnostic data, and treatment plans. These are securely archived in our system for the required retention period, so you don’t need separate manual filing.",
          },
        ],
      },
      {
        id: "faqProvidingRecords",
        title: "Providing Records to Clients",
        blocks: [
          {
            type: "qa",
            question:
              "Am I required to give clients a copy of their pet’s medical records if they ask?",
            answer:
              "Yes. Per BPC § 4855, veterinarians must provide or make records available to the client upon request, including any diagnostic data. You cannot withhold records solely due to an unpaid bill, although you may charge a reasonable fee for copying or transferring them.",
            example:
              "A client switches clinics and asks for their cat’s lab results and treatment notes. You must furnish these promptly, whether the appointment was in person or via telehealth.",
            helpText:
              "Vetcation stores all session notes and diagnostic files in one place. If a client requests a copy, you can quickly export or print the records from our system, ensuring timely compliance with the law.",
          },
        ],
      },
      {
        id: "faqContentOfRecords",
        title: "Required Content in Records",
        blocks: [
          {
            type: "qa",
            question:
              "What specific details must be included in a veterinary medical record?",
            answer:
              "Each record should identify the patient (species, breed, and, if applicable, name), document the presenting complaint, diagnostic tests, findings, treatments, prescribed medications (with dosages), and any follow-up instructions given to the client. Additionally, you must note the date of each visit or telehealth session, as well as who performed each procedure. (BPC § 4855.)",
            example:
              "For a telehealth consult regarding a dog’s skin infection, you’d note the video call date, symptoms observed, medication dosage, and any advice about follow-up or rechecks.",
            helpText:
              "Our telehealth interface prompts you to enter these details before closing a consult. This ensures no required fields are missed, and you have a thorough, legally compliant record for each encounter.",
          },
        ],
      },
      {
        id: "faqTelehealthVsInPerson",
        title: "Telehealth vs. In-Person Records",
        blocks: [
          {
            type: "qa",
            question:
              "Are the recordkeeping requirements different for telehealth appointments compared to in-person visits?",
            answer:
              "No. You must maintain the same standard of documentation regardless of how the VCPR was established or how the consultation took place. The law treats telehealth records the same as in-person records in terms of confidentiality, retention, and content. (BPC §§ 4855, 4856.)",
            example:
              "Whether you physically examine a cat at your clinic or diagnose it via synchronous audio-video, you must record your findings, treatment plan, and client communications in the same level of detail.",
            helpText:
              "Our platform seamlessly integrates telehealth records with any in-person data you upload, so your patient’s file remains complete and consistent.",
          },
        ],
      },
    ],
  },
  MiscellaneousClarifications: {
    mainTitle: "Additional FAQs & Clarifications",
    mainDescription: `Below are extra questions and answers addressing corner cases and nuanced
  scenarios that may still be confusing under California’s AB 1399. While not
  specifically addressed in the earlier sections, these clarifications can help
  veterinarians navigate unique or evolving circumstances in telehealth practice.`,
    sections: [
      {
        id: "faqMultiStateLicense",
        title: "Multiple State Licenses & Traveling Patients",
        blocks: [
          {
            type: "qa",
            question:
              "What if I hold licenses in both California and another state, and my client (with the same pet) travels back and forth between those states? Can I legally provide telemedicine for them in each location?",
            answer:
              "You must comply with the telehealth laws of whichever state the animal is physically located in at the time of the consult. If the patient is in California, you can proceed under your California license, following AB 1399. If the patient travels to your other licensed state, you can switch to practicing under that state’s rules, but you cannot rely on your California license alone in a jurisdiction where you aren’t licensed. Always verify you’re operating within the local telehealth statutes to avoid unlicensed practice.",
            example:
              "You have licenses in both California and Oregon. When the pet is physically in California, AB 1399 applies. The moment they cross into Oregon, you must follow Oregon’s telemedicine requirements—your California telehealth VCPR doesn’t automatically extend across state lines unless Oregon law allows it.",
            helpText:
              "Vetcation’s scheduling prompts can help identify the pet’s current location. If it’s out of California, Vetcation will warn you that California’s AB 1399 rules may not apply. You can then choose to proceed under your Oregon license—assuming you hold one and Oregon’s laws permit telehealth for that scenario.",
          },
        ],
      },
      {
        id: "faqNoSynchronousVideo",
        title: "Telehealth Without Video (Phone or Text Only)",
        blocks: [
          {
            type: "qa",
            question:
              "If I only speak with a client on the phone (or by text/email) and never see the animal via video or in person, does that count as telehealth under AB 1399?",
            answer:
              "Yes, these communications can still be considered telehealth, but you cannot establish a valid VCPR solely through non-visual means (phone, email, or text). Under AB 1399, the veterinarian must use synchronous audio-video to perform an exam if the VCPR hasn’t already been established in person. Phone calls, emails, or text messages may supplement an existing VCPR, but they cannot replace the initial real-time video or in-person exam requirements. (BPC, § 4826.6, subds. (b)(2), (d).)",
            example:
              "A client calls you about their dog’s cough but you’ve never met the animal. Messaging guidance alone cannot establish a new VCPR—you’d either need to see the dog in person or conduct a live video exam before diagnosing or prescribing.",
            helpText:
              "Vetcation supports text or chat-based follow-ups for minor adjustments once the VCPR is formed (via in-person or synchronous video). Our interface keeps a clear record of these communications, ensuring continuity of care without violating AB 1399.",
          },
        ],
      },
      {
        id: "faqInconclusiveExam",
        title: "When Telehealth Exam Is Inconclusive",
        blocks: [
          {
            type: "qa",
            question:
              "What if I attempt a telehealth exam via live video but find I cannot accurately diagnose or assess the animal’s condition? Am I required to refer them for an in-person exam?",
            answer:
              "Yes. If, at any point, you determine that a telehealth exam (even synchronous audio-video) is insufficient to meet the standard of care, you must advise the client to schedule an in-person visit. Telehealth is only permissible when it allows you to gather enough information to make safe, informed medical decisions. If that isn’t possible, continuing solely via telehealth would be inappropriate—and could subject you to disciplinary action if an error occurs. (BPC, § 4826.6, subd. (c).)",
            example:
              "During a video consult for a limping horse, you realize you cannot adequately evaluate lameness without hands-on palpation or diagnostic imaging. You tell the owner they must schedule an in-person exam before you can prescribe or finalize a diagnosis.",
            helpText:
              "Vetcation’s platform includes documentation prompts to note 'telehealth insufficient, recommended in-person exam.' This ensures transparency in your medical record if the Board later reviews why you referred the animal for in-person care.",
          },
        ],
      },
      {
        id: "faqSecondOpinion",
        title: "Second Opinions Via Telehealth",
        blocks: [
          {
            type: "qa",
            question:
              "Can I provide a telehealth-based second opinion if another veterinarian has already established a VCPR with the animal in person?",
            answer:
              "Yes, but to prescribe or diagnose independently, you must form your own VCPR under AB 1399. Often, a second opinion is advisory, with the primary veterinarian retaining responsibility for prescriptions. If you plan to take over care or write new prescriptions yourself, you must either perform a synchronous video exam or see the animal in person. Alternatively, you could rely on the existing in-person VCPR if you are part of the same practice and have access to all the relevant medical records. (BPC, § 4826.6, subd. (b); 16 CCR § 2032.1.)",
            example:
              "A client wants your telehealth opinion about their dog’s complex heart condition. If they share full medical records from the primary vet (and you do a synchronous video exam), you might decide you can advise on additional treatment. But if you plan to prescribe medication yourself, you must ensure you meet AB 1399’s VCPR requirements.",
            helpText:
              "Vetcation makes it easy to upload or request existing records. If the first veterinarian’s records are complete and the video exam is sufficient, you might lawfully proceed with a second-opinion prescription. Otherwise, you can limit your role to offering an opinion that the primary vet implements.",
          },
        ],
      },
      {
        id: "faqEuthanasia",
        title: "Euthanasia Considerations via Telehealth",
        blocks: [
          {
            type: "qa",
            question:
              "Is it legal to perform euthanasia via telehealth, or to guide a client through euthanasia remotely?",
            answer:
              "No. California law requires in-person administration or supervision for euthanasia. Telehealth cannot substitute for the physical presence needed to ensure humane and legally compliant euthanasia. Even if a veterinarian gives verbal instructions, a controlled substance is typically involved, and prescribing or administering it remotely without an in-person exam and direct supervision is prohibited. (BPC, § 4826.6, subds. (i)(6).)",
            example:
              "A client in a remote area asks you to guide them through the euthanasia process by video. This is not allowed because it involves controlled substances and direct supervision requirements that can’t be met via telehealth.",
            helpText:
              "If a client inquires about end-of-life options through Vetcation, you should advise them that California law mandates an in-person procedure. Provide resources for mobile in-person euthanasia services if travel is an obstacle.",
          },
        ],
      },
      {
        id: "faqVetLocationRegistration",
        title: "Veterinarian Physical Location & Facility Registration",
        blocks: [
          {
            type: "qa",
            question:
              "Do I need to register my physical location or maintain a brick-and-mortar facility in California if I’m providing all services through telehealth?",
            answer:
              "Under AB 1399, there’s no requirement to maintain a permanent facility in California solely for telehealth practice—provided you hold a valid, active California DVM license. However, you must still adhere to all Veterinary Medical Board regulations for recordkeeping and potential inspections. If you occasionally perform in-person services or store controlled substances in-state, you might need to register a veterinary premise license. Check Board regulations (BPC, §§ 4853–4854) to confirm whether a premise permit is required for your specific practice model.",
            example:
              "If you’re a fully remote vet living in Nevada but licensed in California, you can conduct telehealth consults for pets located in California without a California brick-and-mortar. But if you decide to offer limited in-person services in California (vaccination clinics, etc.), you’d likely need a registered premise.",
            helpText:
              "Vetcation’s software is designed so you can fully operate virtually without a physical clinic, as long as your license is in good standing and you meet AB 1399’s telehealth requirements. Always check with the Board if you expand into any in-person services that might trigger premise permit obligations.",
          },
        ],
      },
    ],
  },
  // 1. joinVideoCall
  joinVideoCall: {
    mainTitle: "Join a Video Call",
    mainDescription: `
      Vetcation’s video consultation feature enables you to meet clients 
      face-to-face (virtually) and gather information needed 
      to diagnose and treat patients. Below, learn how to access 
      your scheduled calls, test your mic and camera, and begin 
      your real-time telehealth session.
    `,
    sections: [
      {
        id: "howToJoinSection",
        title: "How to Join",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Access Scheduled Appointments",
                lines: [
                  "Go to My Schedule for the upcoming appintment. Press it to navigate to the appointment card.",
                  "Look for a “Join Call” button on the appointment card.",
                ],
              },

              {
                heading: "Stable Internet Connection",
                lines: [
                  "A strong connection helps keep video and audio smooth.",
                  "If using mobile data, find a reliable spot with good reception.",
                ],
              },
              {
                heading: "Start the Call",
                lines: [
                  "Once you’re ready, click Join Call to enter the video call.",
                  "Remember to enable your camera so the client can see you (and vice versa).",
                  "Be mindful of background surroundings for privacy and professionalism.",
                  "Under AB 1399, you must use synchronous audio-video to form a valid VCPR unless you’ve already examined the patient in person.",
                ],
              },
              {
                heading: "Camera Access Prompt",
                lines: [
                  `When you enable your camera, Vetcation may show a prompt such as “Vetcation Would Like to Access the Camera.”`,
                  "Allowing camera access enables you to share live video with the client",
                  "If you tap “Don’t Allow,” you’ll be unable to share your video directly from your device and VCPR establishment cannot be completed.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            imageSrcs: [
              // Replace with your actual screenshot URLs
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8372.PNG?alt=media&token=0e8a49c8-10f0-43ca-99da-902c91a17043",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%201.31.06%20PM.png?alt=media&token=0e2adb20-f48d-4e18-bdc7-0cf3854ad7ba",
            ],
          },
        ],
      },
    ],
  },

  // 2. videoCallFeatures
  videoCallFeatures: {
    mainTitle: "Call Features & Settings",
    mainDescription: `
      Vetcation’s call interface offers more than a basic camera and microphone. 
      From reducing background noise to customizing your video background, 
      these features let you deliver professional, efficient telehealth 
      consultations wherever you are.
    `,
    sections: [
      {
        id: "featureOverview",
        title: "Features Overview",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Camera and Audio Requirements",
                lines: [
                  "To form a valid VCPR via telehealth (if you haven’t examined the patient in person), you must appear on video and turn on the microphone.",
                  "Vetcation prompts you if your camera is off and nudges clients to enable theirs for an in-clinic-like interaction.",
                ],
              },
              {
                heading: "flip Camera",
                lines: [
                  "If you need to show the patient something, tap the camera icon to switch between front and back views.",
                ],
              },
              {
                heading: "Mute/Unmute",
                lines: [
                  "Tap the microphone icon to mute or unmute your audio during the call.",
                ],
              },

              {
                heading: "End Call",
                lines: [
                  "When you’re finished, tap the red Leave icon to leave the video call room.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            imageSrcs: [
              // Replace with your actual screenshot URLs
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.26.35%20PM.png?alt=media&token=a2c17838-bd95-459b-8920-76b75aa9d97a",
              // "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.25.35%20PM.png?alt=media&token=e7e6acaa-c25f-4a8f-9c29-9ad96b057021",
            ],
          },
          {
            type: "bulletList",
            items: [
              {
                heading: "Access Telemedicine Info",
                lines: [
                  "Tap the Vetcation icon during a video call to view important session details in real-time.",
                  "This includes your Appointment ID, the names of both the veterinarian and the pet owner, and the patient’s name.",
                  "You’ll also see confirmation of enhanced encryption and the U.S.-based data center powering the call.",
                  "This feature promotes transparency and trust while also helping you keep accurate documentation during the session.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            imageSrcs: [
              // Replace with your actual screenshot URLs
              // "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.26.35%20PM.png?alt=media&token=a2c17838-bd95-459b-8920-76b75aa9d97a",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.25.35%20PM.png?alt=media&token=e7e6acaa-c25f-4a8f-9c29-9ad96b057021",
            ],
          },
          {
            type: "bulletList",
            items: [
              {
                heading: "Access Telemedicine Info",
                lines: [
                  "Tap the Vetcation icon during a video call to view important session details in real-time.",
                  "This includes your Appointment ID, the names of both the veterinarian and the pet owner, and the patient’s name.",
                  "You’ll also see confirmation of enhanced encryption and the U.S.-based data center powering the call.",
                  "This feature promotes transparency and trust while also helping you keep accurate documentation during the session.",
                ],
              },
            ],
          },
          {
            type: "framedImage",
            imageSrcs: [
              // Replace with your actual screenshot URLs
              // "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.26.35%20PM.png?alt=media&token=a2c17838-bd95-459b-8920-76b75aa9d97a",
              "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.25.35%20PM.png?alt=media&token=e7e6acaa-c25f-4a8f-9c29-9ad96b057021",
            ],
          },
        ],
      },

      {
        id: "UpcomingFeatures",
        title: "Upcoming Features",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Noise Cancellation (upcoming)",
                lines: [
                  "Filters out ambient noise—like clinic chatter or traffic—so you and your client can focus on what matters.",
                  "Helpful if you’re on the move, in a busy setting, or simply want the clearest audio.",
                  "Noise Cancellation will automatically be enabled when you join a call.",
                ],
              },
              {
                heading: "Virtual Backgrounds (upcoming)",
                lines: [
                  "Blur your real environment or replace it with a professional/branded image.",
                  "Use the gear icon → Video tab to choose from a solid color, custom image, or no background.",
                  "Ideal for protecting personal privacy or appearing more polished.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 3. recordingAndConsent
  recordingAndConsent: {
    mainTitle: "Audio Processing & AI Summaries",
    mainDescription: `
      Vetcation uses a secure, audio-only processing system to generate AI-assisted 
      medical records and summaries for each appointment. Unlike platforms that save 
      entire video recordings, Vetcation does not store any media files after 
      processing. This approach safeguards client and veterinarian privacy while 
      preserving accurate, AI-enhanced documentation.
    `,
    sections: [
      {
        id: "recordingBasics",
        title: "Recording Basics & Consent",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "No Media Storage",
                lines: [
                  "Vetcation does not retain video or audio once processing is complete.",
                  "Audio is temporarily captured in real time so our AI can generate summaries, then permanently deleted.",
                  "This minimizes privacy concerns and long-term data risks.",
                ],
              },
              {
                heading: "AI-Assisted Medical Records (No Saved Recordings)",
                lines: [
                  "Audio from the session is briefly processed to produce a draft medical record for review.",
                  "After processing, the raw audio is discarded—only the structured text record remains.",
                ],
              },
              {
                heading: "Client-Facing Summaries",
                lines: [
                  "We create a plain-language recap that clients can view in their portal.",
                  "This summary highlights key discussion points, recommended treatments, and next steps.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "privacySecurity",
        title: "Privacy & Security",
        blocks: [
          {
            type: "bulletList",
            items: [
              {
                heading: "Data Protection",
                lines: [
                  "All live calls are end-to-end encrypted. Only the assigned veterinarian and authorized staff can access session details.",
                  "If audio is processed by our AI, it’s stored only until the summary is generated, then automatically deleted.",
                ],
              },
              {
                heading: "Liability Under BPC § 4857",
                lines: [
                  "A veterinarian can face civil liability for negligent release of confidential information.",
                  "Handle any patient data carefully, whether it’s text, images, or ephemeral audio.",
                ],
              },
              {
                heading: "Deleting Audio Data",
                lines: [
                  "Vetcation’s AI system automatically removes audio once processing is complete.",
                  "No manual deletion is required—ephemeral files never remain in storage.",
                ],
              },
              {
                heading: "Patient Requests",
                lines: [
                  "Clients can request copies of their medical summaries at any time.",
                  "Per BPC § 4855, you must furnish these upon request, even if the client owes a balance.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // Similarly for the other topNav items...
};

// ===================== MAIN COMPONENT ===================== //

export default function DocsPageLayoutPage() {
  // Offcanvas state
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // Track which top-level nav is active
  const [activeTopNav, setActiveTopNav] = useState("home");
  // Track which left sidebar item is currently active
  const [activeSidebarItem, setActiveSidebarItem] =
    useState("introToVetcation");
  // For the right sidebar highlighting, store the current section ID
  const [activeSection, setActiveSection] = useState("");
  const [expandedItems, setExpandedItems] = useState([]); // list of parent IDs that are open
  const [activeItem, setActiveItem] = useState("settingUpAvailability"); // whichever is selected

  // Refs to each section in the middle column for IntersectionObserver
  const sectionRefs = useRef({});

  useEffect(() => {
    // We only observe the sections if we have them
    const currentSidebarData = sideNavData[activeTopNav] || [];
    let allItems = [];
    currentSidebarData.forEach((group) => {
      allItems = allItems.concat(group.items);
    });
    const contentObj = contentData[activeSidebarItem];
    if (!contentObj) return;

    // IntersectionObserver callback
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // The section's ID
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: document.getElementById("mainContentScrollArea"),
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.1,
    });

    // Observe each section in the current content
    contentObj.sections.forEach((sect) => {
      const el = sectionRefs.current[sect.id];
      if (el) observer.observe(el);
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [activeTopNav, activeSidebarItem]);

  // Handler for top nav
  const handleTopNavClick = (item) => {
    setActiveTopNav(item);
    // Reset left sidebar selection to something in that new group
    const firstGroup = sideNavData[item]?.[0];
    if (firstGroup) {
      setActiveSidebarItem(firstGroup.items[0].id);
    }
  };

  // Example: when user clicks on "Scheduling," toggle it in expandedItems
  function handleExpandCollapse(itemId) {
    if (expandedItems.includes(itemId)) {
      // It's currently open; close it
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      // It's currently closed; open it
      setExpandedItems([...expandedItems, itemId]);
    }
  }

  // Example: selecting a sub-item
  function handleSelectItem(itemId) {
    setActiveItem(itemId);
    setActiveSidebarItem(itemId);
    // Ensure the middle content scrolls back to the top:
    const contentContainer = document.getElementById("mainContentScrollArea");
    if (contentContainer) {
      contentContainer.scrollTo({
        top: 0,
        behavior: "smooth", // or 'auto'
      });
    }
  }

  // Handler for left sidebar click
  const handleSidebarItemClick = (id) => {
    setActiveSidebarItem(id);
  };

  // Handler for right sidebar click — we scroll to the ID
  const handleRightSidebarClick = (sectionId) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Determine the content to display in the middle column
  const currentContent = contentData[activeSidebarItem];

  return (
    <PageWrapper>
      {/* ============== TOP NAVIGATION ============== */}
      <TopNavBar>
        {topNavData.map((navItem) => (
          <TopNavLink
            key={navItem.id}
            $active={activeTopNav === navItem.id}
            onClick={() => handleTopNavClick(navItem.id)}
          >
            {navItem.label}
          </TopNavLink>
        ))}

        {/* Hamburger button: only visible below md */}
        <Button
          variant="primary"
          className="d-md-none ms-auto" // d-md-none = hide at md+, ms-auto = push to right
          onClick={() => setShowOffcanvas(true)}
        >
          ☰ Menu
        </Button>
      </TopNavBar>

      {/* ============== BODY: 3-COLUMN LAYOUT ============== */}
      <Container fluid style={{ flex: 1 }}>
        <Row style={{ height: "100%" }}>
          {/* LEFT SIDEBAR */}
          <Col
            xs={12}
            md={3}
            lg={2}
            className="d-none d-md-block"
            style={{
              padding: 0,
              height: "calc(100vh - 60px)", // for example, if your top nav is ~60px
              overflowY: "auto",
            }}
          >
            <MySidebar
              sideNavData={sideNavData}
              activeTopNav={activeTopNav}
              expandedItems={expandedItems}
              handleExpandCollapse={handleExpandCollapse}
              activeItem={activeSidebarItem} // or activeItem
              handleSelectItem={handleSelectItem}
            />
          </Col>

          {/* MIDDLE CONTENT */}
          <Col
            xs={12}
            md={6}
            lg={8}
            style={{ padding: 0, height: "calc(100vh - 60px)" }}
          >
            <MainContent id="mainContentScrollArea">
              {currentContent ? (
                <>
                  <h1>{currentContent.mainTitle}</h1>
                  {/* Render the new descriptive text if present */}
                  {currentContent.mainDescription && (
                    <p
                      style={{
                        color: "#ccc",
                        lineHeight: "1.6",
                        marginTop: "1rem",
                      }}
                    >
                      {currentContent.mainDescription}
                    </p>
                  )}

                  {currentContent.sections.map((sec) => (
                    <div
                      key={sec.id}
                      id={sec.id}
                      ref={(el) => (sectionRefs.current[sec.id] = el)}
                      style={{ marginBottom: "2rem" }}
                    >
                      <h2 style={{ marginTop: "2rem" }}>{sec.title}</h2>
                      {sec.blocks &&
                        sec.blocks.map((block, blockIndex) => {
                          const key = `${sec.id}-block-${blockIndex}`; // stable enough if you won't reorder blocks
                          switch (block.type) {
                            case "bulletList":
                              return (
                                <BulletListBlock key={key} block={block} />
                              );
                            case "qa":
                              return <QAContentBlock key={key} block={block} />;
                            case "trendPoints":
                              return (
                                <TrendPointsBlock key={key} block={block} />
                              );
                            case "framedImage":
                              return (
                                <FramedImageBlock key={key} block={block} />
                              );
                            default:
                              return <p key={key}>{block.content}</p>;
                          }
                        })}
                    </div>
                  ))}
                </>
              ) : (
                <p>No content available.</p>
              )}
            </MainContent>
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col
            xs={12}
            md={3}
            lg={2}
            className="d-none d-md-block" // hides below md, shows at md+
            style={{
              padding: 0,
              height: "calc(100vh - 60px)",
              overflowY: "auto", // add this line
            }}
          >
            <RightSideBar
              currentContent={currentContent}
              activeSection={activeSection}
              handleRightSidebarClick={handleRightSidebarClick}
            />
          </Col>
        </Row>
      </Container>
      {/* ============== OFFCANVAS for the LEFT SIDEBAR (small screens) ============== */}
      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start" // slide from left
        style={{ backgroundColor: "#111" }} // optional, or override .offcanvas style
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Render the same MySidebar here, so it's available on small screens */}
          <MySidebar
            sideNavData={sideNavData}
            activeTopNav={activeTopNav}
            expandedItems={expandedItems}
            handleExpandCollapse={handleExpandCollapse}
            activeItem={activeSidebarItem} // or activeItem
            handleSelectItem={handleSelectItem}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </PageWrapper>
  );
}
