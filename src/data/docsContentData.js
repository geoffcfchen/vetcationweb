/**
 * contentData - For each left sidebar item (e.g. "introToVetcation"), we store the
 * main content sections. Each section has:
 *   - id: unique ID to match with IntersectionObserver
 *   - title: subheading displayed in the middle column (like "Why choose LiveKit?")
 *   - text: paragraph text (can be an array of paragraphs or any React element)
 */

const contentData = {
  home: {
    introToVetcation: {
      mainTitle: "Introduction for Veterinarians",
      mainDescription: `Vetcation is a legally compliant platform that empowers California-licensed veterinarians to launch your own virtual clinic, retain full ownership of clients, patient records, and revenue, and collaborate with clinics to provide telemedicine services. Our mission is to end burnout, build professional and lasting relationships with pet owners, and restore professional autonomy for veterinarians.`,
      sections: [
        {
          id: "missionforvets",
          title: "Our Mission",
          blocks: [
            {
              type: "paragraph",
              text: `Vetcation is designed to address one of the biggest problems in the veterinary field: <span class="highlight">burnout</span>. Solving these problems is not as simple as taking more vacation; it requires building professional, respectful, and lasting relationships with clients. Many vets face a growing backlog of callbacks, owners who call repeatedly and expect hour-long return calls, or clients who are rude or accusatory, often bringing unrealistic expectations and distrustful, argumentative behavior. It only takes one difficult interaction to derail the day. These pressures are a primary driver of burnout and contribute to higher suicide rates within the veterinary profession.`,
            },
            {
              type: "root",
              helpText: `We believe the root cause is the lack of a clear method for building incentive-aligned, trust-based, long-term relationships. People are usually kinder to those with whom they have an ongoing relationship and whom they expect to need in the future. High quality follow-up communication builds trust, but it takes vets' time. The solution is a reliable system that enables efficient communication with a proper compensation mechanism, incentivizing both sides to engage productively. The Vetssenger tool and the Vetcation ecosystem are the solution we have built to solve this issue, protect vets’ time, and ultimately end burnout. The stronger the healthy connection, the better the patient outcomes.`,
            },
          ],
        },
        {
          id: "achieveWithVetcation",
          title: "What Can You Achieve with Vetcation?",
          blocks: [
            {
              type: "paragraph",
              text: "Vetcation enables vets to compound your work into assets you own: a growing client book, a trusted reputation in the professional community, and data that travels with you through every stage of your career.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Build your own virtual clinic and brand:",
                  lines: [
                    "Start a digital practice under your name and nurture strong, lasting client relationships. Your clients, your records, and your revenue stay with you.",
                  ],
                },
                {
                  heading: "Maximize your earning potential:",
                  lines: [
                    "Retain up to 70% of your service fees. A full-time schedule (40 hours a week) can bring in $265,000 or more per year while reducing overhead and growing your independent practice.",
                  ],
                },
                {
                  heading: "Work on your terms, from anywhere:",
                  lines: [
                    "Practice from a clinic, your home, or across the globe. Your client book and medical records travel with you, giving you true career mobility.",
                  ],
                },
                {
                  heading: "Partner with existing clinics:",
                  lines: [
                    "With one click, collaborate with brick-and-mortar clinics to extend your reach. Their clients see your availability, while records and relationships remain part of your professional portfolio.",
                  ],
                },
                {
                  heading: "Your personal AI assistant:",
                  lines: [
                    "Save time with a native AI that drafts Vetssenger notes and generates personalized DAPs. Deliver consistent, high-quality care while protecting your time.",
                  ],
                },
                {
                  heading: "Ensure compliance with AB 1399:",
                  lines: [
                    "Vetcation’s infrastructure aligns with California’s telehealth law, AB 1399, providing automated documentation and audit readiness so your practice stays compliant as it grows.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "telemedicineCases",
          title: "What Cases Are Right for Telemedicine?",
          blocks: [
            {
              type: "paragraph",
              text: "Telemedicine suitability by case type",
            },
            {
              type: "table",
              responsive: "auto", // "scroll" (default), "stack", or "auto"
              stackBreakpoint: 640, // optional
              rowHeaders: false, // set true if first column names the row
              minWidth: "720px", // optional
              columns: [
                { key: "case", title: "Case" },
                { key: "fit", title: "Fit for telemedicine?" },
                { key: "help", title: "How vets help" },
                { key: "escalate", title: "When to escalate to in-person" },
              ],
              rows: [
                {
                  case: "Acute medical concerns",
                  fit: "Often (triage first)",
                  help: "Urgency check, first-aid guidance, next steps.",
                  escalate:
                    "Breathing trouble, collapse, uncontrolled pain/bleeding, suspected blockage → ER/clinic",
                },
                {
                  case: "Behavior (aggression, litter box, etc.)",
                  fit: "Strong fit",
                  help: "Home-context review, behavior plan, trainer coordination.",
                  escalate: "Immediate safety risks or neurologic red flags",
                },
                {
                  case: "Skin issues (rashes, itchiness, redness)",
                  fit: "Strong fit",
                  help: "Photo/video review, topicals/meds, follow-ups.",
                  escalate: "Deep/infected wounds needing procedures",
                },
                {
                  case: "Allergies",
                  fit: "Strong fit",
                  help: "Flare control, diet trials, refills/adjustments (where permitted).",
                  escalate: "Severe systemic reactions",
                },
                {
                  case: "Minor cuts & wounds",
                  fit: "Often",
                  help: "Clean-care guidance, monitoring, refer if sutures likely.",
                  escalate: "Large/deep wounds or bleeding that won’t stop",
                },
                {
                  case: "Nutrition & weight",
                  fit: "Strong fit",
                  help: "Diet selection, weight-loss plans, chronic-care coaching.",
                  escalate: "Rapid unexplained weight loss → diagnostics",
                },
                {
                  case: "GI (vomiting/diarrhea)",
                  fit: "Often (mild cases)",
                  help: "Hydration/diet plan, warning signs to watch.",
                  escalate: "Severe, persistent, bloody, painful, or lethargic",
                },
                {
                  case: "Puppy/kitten wellness & training",
                  fit: "Strong fit",
                  help: "Preventive care counseling, schedules, training tips.",
                  escalate: "Vaccines/exams themselves are in-person",
                },
                {
                  case: "General health & wellness",
                  fit: "Strong fit",
                  help: "Q&A, routine follow-ups, care plans.",
                  escalate: "Anything requiring hands-on exam/tests",
                },
              ],
              note: "Telemedicine is subject to CA rules (live video to establish VCPR; some meds limited).",
            },
          ],
        },
        {
          id: "whyVirtualCareTrend",
          title: "Why Virtual Care Is Growing — And Why It Matters",
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
                    `Over 22% of U.S. counties have no veterinary employees, leaving millions of companion animals in underserved areas (VVCA Report 2024, p. 7).`,
                    `The country faces a deficit of 12,000 veterinarians and 48,000 support staff, demanding innovative solutions like telemedicine (VVCA Report 2024, p. 7).`,
                  ],
                },
                {
                  heading: "Rapid Consumer Adoption:",
                  lines: [
                    "Telehealth has become a key access point for pet owners seeking immediate answers — 50% of global virtual consults address symptomatic issues (VVCA Report 2024, p. 10).",
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
                    "Virtual interactions garner an average 98.4% satisfaction rate — pet owners appreciate the convenience and immediate access to professional advice (VVCA Report 2024, p. 14).",
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
      mainDescription: `Vetcation empowers California-licensed veterinarians to transform remote care into a complete digital practice. Our platform goes beyond basic telemedicine by enabling you to build a branded virtual clinic, complete with secure recordkeeping, automated scheduling, and client management, all while staying fully compliant with AB 1399. Learn the difference between telemedicine and a virtual clinic, the legal compliance, and follow simple steps to set up your own clinic from anywhere.`,
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
          id: "overviewSteps",
          title: "Overview of Steps",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0889.webp?alt=media&token=e54cfd43-85fa-4235-a06b-c81509158953",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0891.webp?alt=media&token=8d64e774-b865-4ccb-8763-a4c04195714a",
              ],
            },
            {
              type: "paragraph",
              text: `In telemedicine setting, here's a quick overview of the steps to set up your virtual clinic with Vetcation. Each step is explained in detail below. If the status icon in each item is not red, you have completed the necessary information in that step! Once you complete all steps, you can start setting up your regular availability and begin seeing clients.`,
            },
          ],
        },
        {
          id: "updateLegalProfile",
          title: "Update Legal Profile",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0892.webp?alt=media&token=78568895-0f32-4930-9d36-bca32b1bca4a",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0893.webp?alt=media&token=b850419d-61e7-430d-af5f-1b8636ec8317",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Legal first and last name:",
                  lines: [
                    "Make sure this matches your California license records.",
                  ],
                },
                {
                  heading: "Phone number:",
                  lines: ["Used for secure pharmacy contact."],
                },
                {
                  heading: "Address:",
                  lines: [
                    "List your legal business address. This can be your home address if you do not conduct in-person exams on-site.",
                  ],
                },
                {
                  heading: "Licenses:",
                  lines: [
                    "Upload a current California veterinary license. Ensure expiration dates are accurate.",
                  ],
                },
                {
                  heading: "Professional liability insurance (recommended):",
                  lines: [
                    "Upload a current certificate of professional liability insurance.",
                  ],
                },
                {
                  heading: "Specialist certifications (if applicable):",
                  lines: [
                    "Upload any relevant specialist certifications. If you are a general practitioner, you can skip this. Specialists will obtain different badges on your profile.",
                  ],
                },
                {
                  heading: "Your signature:",
                  lines: [
                    "Provide a digital signature to appear on records and prescriptions, where required.",
                  ],
                },
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
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0895.webp?alt=media&token=cb00ae2d-8e60-4fc1-95bc-2a302b56be3c",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0896.webp?alt=media&token=60934702-08cb-4fe6-8096-189bfe664de9",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "About me:",
                  lines: [
                    "Write a short, friendly introduction to help pet owners get to know you.",
                  ],
                },
                {
                  heading: "Which animals can you treat:",
                  lines: [
                    "Specify if you treat dogs, cats, exotics, horses, etc.",
                  ],
                },
                {
                  heading: "Languages:",
                  lines: [
                    "List any languages you speak to make care accessible to diverse pet owners.",
                  ],
                },
                {
                  heading: "Specialized in:",
                  lines: [
                    "Mention any specialties such as dermatology, behavior, nutrition, etc. You can select multiple specialties even if you are a general practitioner.",
                  ],
                },
                {
                  heading: "Interested in:",
                  lines: [
                    "Share your clinical interests to help match with ideal cases.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "setRate",
          title: "Set Rate",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0897.webp?alt=media&token=f37622c3-0b7f-41bb-a7da-aaace70c6ea1",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0898.webp?alt=media&token=dc216572-b1cc-4a1f-b6f2-394783b3502e",
              ],
            },
            {
              type: "paragraph",
              text: `Setting your consultation rate is a crucial step in establishing your virtual clinic. Your rate should reflect your expertise, the value of your time, and the quality of care you provide. Consider factors such as your years of experience, any specialties you offer, and the typical rates in your area. `,
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Choose your consultation rate",
                  lines: [
                    "Set the default price clients will pay for each virtual visit. This rate can be adjusted when setting up your availability.",
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
          ],
        },
        {
          id: "setMinimumNotice",
          title: "Set Minimum Notice Time",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_8347.PNG?alt=media&token=afa7a1d0-fd76-4c70-b9ff-603396f2d151",
              ],
            },
            {
              type: "paragraph",
              text: `Some veterinarians only need about 15 minutes’ notice to get ready for an appointment, while others prefer a few hours in advance. Be sure to set your minimum booking notice in a way that fits your schedule, giving you enough time to prepare your space and get ready for each appointment.`,
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Define how far in advance clients can book",
                  lines: [
                    "Choose a minimum notice period to help manage your time effectively.",
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
          ],
        },
        // next will be  Set follow-up fee
        {
          id: "setFollowUpFee",
          title: "Set Follow-Up Fee",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0899.webp?alt=media&token=2299fb00-7d12-40b8-a93d-2b685b4c25c4",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0900.webp?alt=media&token=3c6ab220-b311-4d0c-b636-dd8ad3d2c4ac",
              ],
            },
            {
              type: "paragraph",
              text: `What is a follow-up fee? It’s a small, per-case charge shown to the pet owner when they start a new Vetssenger case to ask post-visit questions that require your professional time. Vetssenger is available only after a valid VCPR is established (in-person or synchronous video per AB 1399). Each thread contains one veterinarian, one pet owner, and one patient. When a pet owner starts a case, they see the fee upfront and can withdraw anytime before you join—no charge is made until you join. When you start a case, it’s free for the client (ideal for proactive rechecks and progress check-ins), helping you build trust while keeping expectations clear and your time protected. For the full workflow, see the Vetssenger section.`,
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Charge for follow-up messages:",
                  lines: [
                    "Set a fee for owner-initiated Vetssenger cases so your time is valued and protected.",
                  ],
                },
                {
                  heading: "Encourage meaningful communication:",
                  lines: [
                    "A modest fee helps manage expectations and encourages concise, relevant questions.",
                  ],
                },
                {
                  heading: "Transparent & fair:",
                  lines: [
                    "Owners see the fee before sending; they aren’t charged unless you join the case. Vet-initiated cases are free to the client.",
                  ],
                },
                {
                  heading: "Aligned with VCPR:",
                  lines: [
                    "Follow-ups occur only within an established VCPR and focus on rechecks, clarifications, and progress updates.",
                  ],
                },
              ],
            },
            {
              type: "paragraph",
              text: `See details in the “Vetssenger Overview” section for case states, tabs, and examples of when to use follow-ups vs. in-person care.`,
            },
          ],
        },
        // set follow up window: How long can pet owners initiate follow-up inquiries for free after an appointment?
        {
          id: "setFollowUpWindow",
          title: "Set Follow-Up Window",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0906.webp?alt=media&token=0a4b3be9-2482-4ab4-a603-366ca782fcba",
              ],
            },
            {
              type: "paragraph",
              text: `The follow-up window defines how long after a qualifying visit (in-person or synchronous video under a valid VCPR) a pet owner may start a Vetssenger case for free. Outside this window, owner-initiated cases show your follow-up fee upfront. Vet-initiated cases are always free to the client.`,
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Define your free period",
                  lines: [
                    "Choose how many hours after the visit an owner can start a free case.",
                    "Common choices: 48–72 hours for general visits.",
                  ],
                },
                {
                  heading: "How eligibility works",
                  lines: [
                    "Free vs. paid is determined at the time the owner starts the case.",
                    "Within the window: free. After the window: your follow-up fee applies and is shown before they proceed.",
                  ],
                },
                {
                  heading: "Aligned with VCPR:",
                  lines: [
                    "Follow-ups are available only when a valid VCPR exists (AB 1399). Each thread is one vet, one owner, one patient.",
                  ],
                },
                {
                  heading: "Transparent & fair:",
                  lines: [
                    "Owners see the window status (e.g., “Free follow-ups until Oct 12”). No charge occurs unless you join a paid case.",
                  ],
                },

                {
                  heading: "Balance support and boundaries:",
                  lines: [
                    "Pick a window that encourages timely rechecks while protecting your time from unlimited open-ended messaging.",
                  ],
                },
                {
                  heading: "When to redirect:",
                  lines: [
                    "If a message suggests urgency or hands-on care, direct the client to an in-person visit or ER.",
                  ],
                },
              ],
            },
          ],
        },
        // EULA agreement
        {
          id: "agreeEULA",
          title: "Agree to EULA",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0905.webp?alt=media&token=1f4cc09b-2138-4437-afab-34e494642eb5",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Review the End User License Agreement (EULA)",
                  lines: [
                    "Carefully read through the EULA to understand your rights and responsibilities when using Vetcation’s platform.",
                  ],
                },
                {
                  heading: "Accept the terms",
                  lines: [
                    "You must agree to the EULA to activate your virtual clinic and start seeing clients.",
                  ],
                },
              ],
            },
          ],
        },
        // set availability
        {
          id: "setAvailability",
          title: "Regular Availability",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0907.webp?alt=media&token=196b0693-49a2-4ff0-8caf-8711e293faec",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0908.webp?alt=media&token=fb7b992d-2db4-48b4-8f01-9b3506edeb15",
              ],
            },
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
          ],
        },
        {
          id: "done",
          title: "Done!",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading:
                    "You’re all set! You can now start accepting virtual appointments through your clinic.",
                  // lines: [
                  //   "You can now start accepting virtual appointments through your clinic.",
                  // ],
                },
              ],
            },
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0909.webp?alt=media&token=69cf35b9-3095-4b8c-8812-12546b33a95c",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0910.webp?alt=media&token=39fb9306-70ea-4f74-88e4-7fe2d2c486d3",
              ],
            },
          ],
        },
      ],
    },

    ViewingYourUpcomingAppointments: {
      mainTitle: "Viewing Your Upcoming Appointments",
      mainDescription: `Vetcation’s scheduling system is designed to make managing your appointments as easy as possible.
      You can view all your upcoming appointments in a calendar format, allowing you to see your schedule at a glance.
      You can choose to view your appointments by day, week, or month, depending on your preference. This flexibility allows you to plan your time effectively and ensure you never miss a virtual consult.`,
      sections: [
        {
          id: "viewingUpcomingAppointments",
          title: "Viewing Your Upcoming Appointments",
          blocks: [
            {
              type: "qa",
              question:
                "How do I view my upcoming appointments in the calendar?",
              answer: `You can access "My calendar" from the drawer. The calendar displays all your upcoming appointments.`,
            },
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0889.webp?alt=media&token=e54cfd43-85fa-4235-a06b-c81509158953",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0920.webp?alt=media&token=6ce4dd2d-e4a1-4225-b917-1643b6a05fcd",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
              ],
            },
          ],
        },
      ],
    },

    VideoCall: {
      mainTitle: "Video Call",
      mainDescription: `Vetcation’s telemedicine system is designed to help you provide high-quality virtual consultations with ease.
      The platform allows you to conduct video calls with clients, share medical records, and manage prescriptions—all in a secure and compliant environment. You can also use the system to document your consultations, ensuring that you have a complete record of each appointment. This feature is essential for maintaining compliance with California’s telemedicine regulations and providing the best possible care to your patients.`,
      sections: [
        {
          id: "telemedicineOverview",
          title: "Telemedicine Overview",
          blocks: [
            {
              type: "qa",
              question: "How does Vetcation’s telemedicine system work?",
              answer:
                "Vetcation’s telemedicine system allows you to conduct video calls with clients, share medical records, and manage prescriptions in a secure and compliant environment. You can document your consultations, ensuring that you have a complete record of each appointment.",
            },
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%2011.12.55%20PM.png?alt=media&token=e653f8e4-4a3b-43b2-b8b4-6c8b33b0350f",
              ],
            },
          ],
        },
      ],
    },

    postAppointment: {
      mainTitle: "Post-Appointment",
      mainDescription: `After the video call, you are required to complete and submit the DAP (Data, Assessment, Plan) note and prescribe any medications if necessary, in accordance with legal and professional guidelines.`,
      sections: [
        {
          id: "postAppointmentOverview",
          title: "Post-Appointment Overview",
          blocks: [
            {
              type: "qa",
              question:
                "What should I do after the video call with the client?",
              answer:
                "You should complete and submit the DAP (Data, Assessment, Plan) note, as required by law and professional standards.",
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8436-min.PNG?alt=media&token=411c4e80-0574-45db-8b51-861347869779",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8610-min.PNG?alt=media&token=d6d72496-acd5-482c-b536-5473434f2404",
              ],
            },
            {
              type: "qa",
              question: "What if I need to prescribe medications?",
              answer:
                //focus on only use Mixlab for now.
                "If medication is needed, you can prescribe directly through the Vetcation platform. The following screens shows how you use prescriptions with Mixlab. Vetcation has partnered with Mixlab to provide a seamless experience for prescribing and managing medications. You can select medications from Mixlab's formulary, send prescriptions electronically to the client's preferred pharmacy, and track the status of each prescription within the platform. This integration ensures that you can provide comprehensive care while maintaining compliance with legal requirements. We are working on integrating more pharmacy partners.",
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8607-min.PNG?alt=media&token=58dfd464-ceb6-4ae6-a57d-a611b1b2f1b3",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8608-min.PNG?alt=media&token=1f921da1-4099-4007-8600-f6f7ab94ef3d",
              ],
            },
          ],
        },
      ],
    },

    earnings: {
      mainTitle: "Earnings & Wallet",
      mainDescription: `Vetcation’s earnings and wallet system is designed to help you manage your income from virtual consultations effectively.
      You can view your earnings in real-time, track your transactions, and manage your wallet balance. The system provides a clear overview of your earnings, including completed consultations, pending payments, and any fees associated with your transactions. This transparency allows you to stay on top of your finances and make informed decisions about your virtual practice.`,
      sections: [
        {
          id: "earningsOverview",
          title: "Earnings Overview",
          blocks: [
            {
              type: "qa",
              question: "How do I view my earnings and wallet balance?",
              answer:
                "You can access your earnings overview from Wallet. This section provides a detailed breakdown of your income, including completed consultations and follow-up charges from Vetssenger — our inquiry-based messaging tool.",
            },
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8463-min.PNG?alt=media&token=d03c4ad9-d5c0-43a0-a5a9-6c83f1c5a5db",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0913.webp?alt=media&token=561430b0-4d31-495c-834f-2d4be226bb5b",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0914.webp?alt=media&token=9812d8b6-0d91-4e59-a61e-0235b6d4dd4c",
              ],
            },
          ],
        },
      ],
    },

    telemedicineAnalysis: {
      mainTitle: "Telemedicine Analysis",
      mainDescription: `Understand your client growth and clinical outcomes at a glance. Use the time range chips (7D / 2W / 4W / 3M / 1Y) and the aggregation control (Daily / Weekly / Monthly) to switch views. Numbers update instantly as you filter by period and provider.`,
      sections: [
        {
          id: "clientsAnalytics",
          title: "Clients — Growth & Cohorts",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0901.webp?alt=media&token=44f2755d-5166-4732-8a7f-d1193377d8bf", // replace with your hosted URL
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Total clients",
                  lines: [
                    "Counts unique pet owners who have ever booked with you (lifetime within the selected scope).",
                    "Card shows the current total; the chart shows counts over time by the chosen aggregation.",
                  ],
                },
                {
                  heading: "New (period)",
                  lines: [
                    "New, first-time clients added within the selected time window.",
                    "Helps you see acquisition spikes after campaigns or clinic partnerships.",
                  ],
                },
                {
                  heading: "Time & aggregation",
                  lines: [
                    "Use 7D/2W/4W/3M/1Y to change the window.",
                    "Switch Daily / Weekly / Monthly to smooth out volatility.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "primaryOutcomes",
          title: "Telemedicine Outcomes — Primary Distribution",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0902.webp?alt=media&token=7e29f6c0-db47-411a-bd27-e048de78acd9", // replace with your hosted URL
              ],
            },
            {
              type: "paragraph",
              text: `The donut shows one primary outcome per visit. Totals and percentages reflect the time range and any provider filter.`,
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Outcome types (examples)",
                  lines: [
                    "Resolved — Issue managed via telemedicine.",
                    "Prescribed meds — Medication initiated.",
                    "Recheck (telemed) — Scheduled follow-up via telemedicine.",
                    "Escalate to in-person — Directed to in-clinic care.",
                    "Refer other doctors — Referred to another veterinarian/specialist.",
                    "ER — Referred to emergency care.",
                    "Monitor — Observation with safety-net advice.",
                  ],
                },
                {
                  heading: "Provider selector",
                  lines: [
                    "Tap the avatar/badge to scope results to a single doctor (e.g., Dr. Yu) or to all providers.",
                  ],
                },
                {
                  heading: "Total visits",
                  lines: [
                    "Link shows the count of visits represented in the donut; tap to view the underlying visit list (if enabled in your UI).",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "allSelectedOutcomes",
          title: "All Selected Outcomes — Secondary Tags",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0903.webp?alt=media&token=1a170d16-cff7-4176-b8c9-b925a689c014", // replace with your hosted URL
              ],
            },
            {
              type: "paragraph",
              text: `This bar chart counts every outcome tag selected on a visit (not just the primary). One visit can contribute to multiple bars, so “Total selections” can exceed “Total visits.” Use this to see workflow patterns—for example, how often a visit includes both “Prescribed meds” and “Recheck (telemed).”`,
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Compare with donut",
                  lines: [
                    "Donut = one primary outcome per visit.",
                    "Bars = all outcomes checked on that visit.",
                  ],
                },
                {
                  heading: "Quality & triage signals",
                  lines: [
                    "Rising ‘Escalate to in-person’ or ‘ER’ flags may indicate improved triage or case mix changes.",
                    "Stable ‘Recheck (telemed)’ often reflects good continuity of care.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "definitionsNotes",
          title: "Definitions & Notes",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Time range logic",
                  lines: [
                    "Charts and cards honor the active range and aggregation.",
                    "Percentages are computed within that filtered set.",
                  ],
                },
                {
                  heading: "Primary vs. additional outcomes",
                  lines: [
                    "Primary outcome is required and mutually exclusive per visit.",
                    "Additional outcomes are optional, many-to-one with the visit.",
                  ],
                },
                {
                  heading: "Data freshness",
                  lines: [
                    "Analytics update in near real-time after a visit is closed and outcomes are saved.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    scheduleOverview: {
      mainTitle: "Scheduling Overview",
      mainDescription: `Welcome to your scheduling hub! This section provides a high-level view of all the tools available for managing your appointments — from setting your regular weekly schedule and adding specific time slots to pausing your availability and viewing your calendar. Whether you’re a first-time user or looking to optimize your current setup, this overview helps you understand how all the pieces fit together.`,
      sections: [
        {
          id: "schedulingIntro",
          title: "How the Scheduling System Works",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8366.PNG?alt=media&token=764e39fe-263f-4b6f-803e-946b2bd20c30",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Regular Availability:",
                  lines: [
                    "Set the days and times you’re generally available. The system automatically creates recurring 30-minute appointment slots for up to 30 days in advance.",
                  ],
                },
                {
                  heading: "Specific Availability:",
                  lines: [
                    "Add extra availability on specific days and times, perfect for accommodating special requests or busy periods.",
                  ],
                },
                {
                  heading: "Minimum Booking Notice Time:",
                  lines: [
                    "Define how much advance notice you need for a client to book an appointment, balancing preparation time with optimal visibility.",
                  ],
                },
                {
                  heading: "Pause Availability:",
                  lines: [
                    "Temporarily hide your profile and stop new bookings without affecting existing appointments.",
                  ],
                },
                {
                  heading: "Manage My Schedule:",
                  lines: [
                    "View all your upcoming appointments in a calendar view and easily join or cancel sessions.",
                  ],
                },
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
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_8347.PNG?alt=media&token=afa7a1d0-fd76-4c70-b9ff-603396f2d151",
              ],
            },
            {
              type: "qa",
              question:
                "What is the minimum booking notice time, and why is it important for telemedicine appointments?",
              answer:
                "Minimum booking notice time is the shortest amount of advance notice you require from clients when scheduling telemedicine appointments. For example, you might set a minimum notice of 15 minutes, meaning clients must book at least 15 minutes ahead. Choosing a shorter minimum booking notice can significantly improve your visibility and ranking with potential clients, especially those who need acute care quickly. Many clients seek appointments within a 30-minute window, making your responsiveness and availability critical to attracting new clients. Selecting a minimum booking notice time that suits your schedule ensures you have adequate preparation time, while also optimizing your opportunity to assist clients promptly.",
            },
          ],
        },
      ],
    },

    regularAvailability: {
      mainTitle: "Regular Availability",
      mainDescription: `Regular Availability puts you in control of your schedule. You can set the times you’re available for appointments, and the system will automatically generate 30-minute appointment slots for the next 30 days based on your preferences. Once your regular availability is set, the system will continuously maintain this 30-day window by creating new slots each day. Clients can instantly book available times, and any updates you make will immediately reflect in future open slots — no manual adjustments needed.`,

      sections: [
        {
          id: "regularAvailabilitySetup",
          title: "Regular Availability Setup",
          blocks: [
            {
              type: "qa",
              question: "How do I set my Regular Availability?",
              answer:
                "From your availability settings, you can customize your weekly schedule — Monday through Sunday. Choose one or more time slots per day and assign different rates as needed. It's flexible, and you're in charge.",
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
      mainDescription: `Pause Availability lets you temporarily hide your profile and stop new appointments from being booked. Whether you need an hour, a day, a week, or time off until a specific date, you can pause your availability quickly from this feature. This is perfect for handling last-minute conflicts, planned time off, or unexpected changes. Pausing only affects new bookings — any appointments already scheduled during the pause period will remain on your calendar and will not be canceled. The system will automatically reopen your schedule when the pause ends.`,

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
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8363.PNG?alt=media&token=f9ab1141-b8e7-4050-9ae0-68cc533fb4a5",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8364.PNG?alt=media&token=bda8ae8f-b822-441c-83cd-f1e81063058e",
              ],
            },
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
              type: "qa",
              question: "How do I view my upcoming appointments?",
              answer:
                "You can press any of the appointment in the calendar to view the details of the appointment.",
            },
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8366.PNG?alt=media&token=764e39fe-263f-4b6f-803e-946b2bd20c30",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
              ],
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
                  lines: [
                    "You can join the synchronous call with the patient.",
                  ],
                },
                {
                  heading: "Cancel:",
                  lines: [
                    "You can cancel the appointment. (see detail cancellation explanation in the next section)",
                  ],
                },
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
          id: "telehealthStandardOfCare",
          title: "Telemedicine Holds the Same Standard of Care",
          blocks: [
            {
              type: "paragraph",
              text: "Telemedicine must meet the same standard of care as in-person veterinary services. Under AB 1399, before delivering veterinary medicine via telehealth, the veterinarian shall inform the client about the use and potential limitations of telehealth and obtain their consent. (Business and Professions Code (BPC), § 4826.6, subd. (g).)",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Same standards of care apply:",
                  lines: [
                    "The same standards of care apply to veterinary medicine services via telehealth and in-person veterinary medical services.",
                  ],
                },
                {
                  heading: "In-person visit option:",
                  lines: [
                    "The client has the option to choose an in-person visit from a veterinarian at any time.",
                  ],
                },
                {
                  heading: "Follow-up and tech-failure guidance:",
                  lines: [
                    "The client has been advised how to receive follow-up care or assistance in the event of an adverse reaction to the treatment or in the event of an inability to communicate resulting from technological or equipment failure.",
                    "Vetcation provides Vetssenger (inquiry-based messaging tool; see vetssenger section in user manual) to facilitate timely follow-up communication and support, helping you comply with AB 1399 and deliver the same standard of care as in-person visits.",
                  ],
                },
              ],
            },
          ],
        },
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
                "Our platform automatically checks the patient's reported location at the time of scheduling. If an out-of-state location is detected, Vetcation will block the client from booking a new telemedicine appointment to ensure compliance with state regulations. However, if there is an existing prescription on file, you may still authorize refills without it being classified as a telehealth service.",
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
                "No. Under AB 1399, prescribing any new medication while the animal is physically outside of California is considered telehealth and is not permitted — even if the diagnosis (such as gastroenteritis) was previously established. The only exception is authorizing a refill of an existing prescription. Initiating a new treatment plan, even under the same diagnosis, is not allowed if the animal is not in California.",
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
                "Yes. Under AB 1399, veterinary telehealth is legally considered to occur at the location of the animal patient — not the veterinarian. As long as the animal is physically in California at the time of the telemedicine consult, a California-licensed veterinarian may practice via telehealth even if they are located outside of California or outside the United States.",
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
                "Our platform allows clients to select their preferred pharmacy — whether a physical location like Costco, Walmart, or CVS, or an online pharmacy such as Mixlab or Chewy. Vets can confirm the client’s choice directly in the Vetcation interface before finalizing a prescription, ensuring compliance with AB 1399 and other state regulations.",
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
                "Our platform is designed with secure data handling and encrypted communication to protect confidential information during telehealth sessions. Vetcation also provides access controls so that only authorized users can view client records, reducing the risk of accidental disclosure. We recommend veterinarians familiarize themselves with all relevant privacy regulations and use best practices — such as password protection, secure networks, and careful record-sharing protocols—to minimize liability.",
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
                "Telehealth cannot be used if the veterinarian does not obtain and review the relevant medical history for the animal. However, actual medical records are not strictly required — if the client can relay the pet’s relevant history verbally or via written form, that may suffice. If official medical records are available, the veterinarian must obtain and review them before proceeding. (BPC, § 4826.6, subd. (h)(2).)",
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
                "Our platform automatically provides veterinarians with local emergency contact information based on the client’s reported location. This includes the name, address, and phone number of nearby clinics or hospitals. You can still choose to add notes or reference other resources, but the system helps ensure you are equipped with key information. If the Board requests validation, you’ll have easy access to records demonstrating your familiarity with local medical resources, supporting compliance with AB 1399.",
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
                "Our platform prioritizes a stable audio-video connection, allowing vets to meet the synchronous requirement. If a technical interruption occurs, Vetcation enables quick reconnection or rescheduling so that you can complete the real-time exam.",
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
                "Our platform includes a pre-consultation form where clients must disclose whether the horse is involved in racing or training under the CHRB. Vetcation automatically stores this information in the patient’s record, providing written proof that the veterinarian asked — and the client answered — before issuing any telehealth prescriptions.",
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
                "Under California law, a veterinary assistant may administer a prescribed vaccine at a registered veterinary premises if and only if the vaccine is not a controlled substance or otherwise “restricted” (BPC § 4836.1(a)). In that scenario, the assistant may work either under the indirect supervision of a veterinarian who ordered the vaccine—even if that vet performed the exam via telemedicine—or under the direct supervision of a Registered Veterinary Technician (RVT) physically on-site (BPC, § 4836.1, subds. (a), (b); CCR, tit. 16, §§ 2034, subs. (f), 2036.5, subs. (b).).",
              example: "",
              helpText:
                "Our platform timestamps and documents every step of a telemedicine visit and enforces that only non-controlled vaccines are used. At the point of administration, it prompts you to confirm “Indirect Vet Supervision,” so the assistant can proceed under the remote veterinarian’s orders, ensuring clear roles and full compliance with California law.",
            },
          ],
        },
        {
          id: "faqNonVaccineInjectables",
          title:
            "Giving Non-vaccine Injections (for example Cytopoint) after a Tele-VCPR",
          blocks: [
            {
              type: "qa",
              question:
                "After a video exam that recommends an injection at a partner clinic, does the pet need another in-person exam first? Can staff give the shot if the prescriber is remote?",
              answer:
                "If you established a valid VCPR by synchronous audio-video while the animal was in California, a second in-person exam is not automatically required to carry out that plan. At a registered premises, an RVT or a trained veterinary assistant may administer a prescribed, non-controlled injectable such as Cytopoint on your order under indirect supervision. Indirect means you are not on site but are quickly available and have provided instructions. If the clinic prefers to become the attending provider of record, their DVM may perform a brief exam and take over before administering.",
              helpText:
                "Legal anchors to cite in your handbook: BPC § 4826.6 for tele-VCPR, BPC § 4836.1 and 16 CCR § 2034 for supervision and task delegation. In Vetcation, include a written administration order with dose and route, a checkbox for Indirect Vet Supervision, and a field to record the RVT or assistant who administered the dose.",
              example:
                "Dermatology video visit on Monday. Order Cytopoint 20 mg SC at Partner Clinic A. Clinic logs Indirect supervision by Dr. Smith and RVT Jones administered. Administration record syncs back to your chart and to the client’s primary DVM.",
            },
          ],
        },
      ],
    },

    // ====== NEW VCPR SECTION ======
    VCPR: {
      mainTitle: "Veterinarian-Client-Patient Relationship (VCPR)",
      mainDescription: `A valid, <span class="highlight">condition-specific</span> VCPR is the cornerstone of providing
veterinary care, whether in person or via telehealth. Under California law
(BPC § 4826.6) a separate VCPR must be formed for each new clinical
condition. A VCPR may be established by:  
(1) synchronous audio-video examination,  
(2) in-person examination of the animal, or  
(3) medically appropriate, timely visits to the <span class="highlight">premises where a herd,
flock, or other group of animals is kept</span> (not routine house-calls for
individual pets).  
The FAQs below explain each pathway and how Vetcation helps you remain
compliant.`,
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
                "A VCPR exists when a veterinarian (1) assumes responsibility for medical" +
                " judgments regarding a specific condition of an animal patient, and" +
                " (2) the client agrees to follow the veterinarian’s instructions. The" +
                " veterinarian must be sufficiently familiar with the animal’s present" +
                " condition (via in-person exam, synchronous audio-video exam, or" +
                " timely premises visits) and must communicate a treatment or" +
                " diagnostic plan to the client. Each new condition (e.g., otitis vs." +
                " dermatitis) requires a new VCPR. (BPC § 4826.6(a), (b)).",
              example:
                "You perform a live video exam for a dog’s skin infection and advise a" +
                " treatment plan. Two months later the same dog injures its leg; that" +
                " orthopedic issue requires establishing a new VCPR before you may" +
                " diagnose or prescribe for that condition.",
              helpText:
                "Vetcation logs every exam (in-person or video) with its associated" +
                " condition, giving you an audit trail that demonstrates compliance" +
                " if questions arise.",
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
                "AB 1399 allows a veterinarian to establish a condition-specific VCPR by" +
                " examining the patient in real time using two-way audio-video." +
                " (BPC § 4826.6(b)(2)).",
              example:
                "During a Vetcation video call, you observe a dog’s pruritic skin," +
                " discuss history, and develop a treatment plan—thereby forming a" +
                " VCPR for that dermatologic condition.",
              helpText:
                "The platform records the date, duration, and condition so you can" +
                " verify that the exam met the synchronous requirement.",
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
                "An in-person exam remains the traditional pathway. Once you have" +
                " physically examined the animal for a given condition, you may" +
                " deliver follow-up telehealth services for that same condition—up to" +
                " the prescription time limits outlined below. (BPC § 4826.6(b)(1)).",
              example:
                "A cat seen in clinic for chronic kidney disease on 1 Jan 2025 may" +
                " receive telehealth management of *that* disease thereafter—subject" +
                " to drug-specific renewal limits.",
              helpText:
                "Vetcation links the in-person visit to its condition so later" +
                " telehealth encounters reflect a valid VCPR.",
            },
          ],
        },
        {
          id: "faqPremisesVisit",
          title: "Premises Visits (Herd / Stable)",
          blocks: [
            {
              type: "qa",
              question:
                "What is a premises visit, and how does it establish a VCPR?",
              answer:
                "A premises visit is an on-site evaluation of animals kept as a herd," +
                " flock, or stable group. Home visits for individual companion" +
                " animals do *not* qualify. (BPC § 4826.6(b)(3)).",
              example:
                "You inspect a goat herd at a ranch—creating a VCPR for herd health" +
                " conditions you assessed. Future telemedicine consults for that herd" +
                " can rely on the premises-based VCPR, within prescription limits.",
              helpText:
                "Each premises visit is time-stamped and condition-tagged in" +
                " Vetcation’s records to demonstrate compliance.",
            },
          ],
        },
        // ...Add more FAQs about VCPR as needed...
      ],
    },

    PrescriptionLimits: {
      mainTitle: "Prescription Time Limits under AB 1399",
      mainDescription: `Once a valid, condition-specific VCPR is established, California law
(BPC § 4826.6(i)) imposes <span class="highlight">drug-specific</span> renewal limits. The one-year
and six-month clocks apply only to <span class="highlight">the same drug</span> originally
prescribed for that condition; switching to a different medication
requires clinical reassessment regardless of time elapsed.`,
      sections: [
        {
          id: "faqGeneralOverview",
          title: "General Overview",
          blocks: [
            {
              type: "qa",
              question: "Why do different prescription time limits apply?",
              answer:
                "California distinguishes between VCPRs formed in person versus by" +
                " synchronous video. For a drug first prescribed after an in-person" +
                " exam, you may refill that *same* drug for up to one year. If the" +
                " VCPR was formed solely via video, refills of that same drug are" +
                " limited to six months—or 14 days for antimicrobials.",
              example:
                "You examine a dog in clinic on 1 Mar 2025 and start carprofen. Carprofen refills are allowed until 1 Mar 2026. If the same dog’s allergy flare is managed by a video VCPR on 1 Apr 2025 with apoquel, apoquel refills can continue only until 1 Oct 2025 unless you re-examine first.",
              helpText:
                "Vetcation tracks the drug name, exam type, and prescription date. If you attempt to refill beyond the one-year, six-month, or 14-day window, the system flags it and prompts a new exam.",
            },
          ],
        },
        {
          id: "faqOneYearLimit",
          title: "1-Year Limit (After In-Person Exam)",
          blocks: [
            {
              type: "qa",
              question:
                "How long can I refill a medication after an in-person exam?",
              answer:
                "For the *same medication* and condition, up to one year from the exam" +
                " date. New medications or new conditions require a fresh exam." +
                " (BPC § 4826.6(i)(2)).",
              example:
                "You examine a cat in person on 1 Jan 2025 and start benazepril." +
                " Benazepril may be refilled until 1 Jan 2026. Initiating amlodipine" +
                " for a new hypertension diagnosis would first require a new exam.",
              helpText:
                "Vetcation automatically tracks the date and type of the last in-person exam for each condition. As the one-year mark approaches, the system alerts you and, if you attempt a refill past the deadline, blocks the prescription until a new exam is logged.",
            },
          ],
        },
        {
          id: "faqSixMonthLimit",
          title: "6-Month Limit (Video-Only VCPR)",
          blocks: [
            {
              type: "qa",
              question: "What if the VCPR was formed via synchronous video?",
              answer:
                "The *same drug* may be refilled for up to six months from that video" +
                " exam. After six months—or for a different drug—you must re-examine" +
                " the patient. (BPC § 4826.6(i)(4)).",
              example:
                "A 1 Feb 2025 video consult leads to gabapentin for chronic pain." +
                " Gabapentin refills are permissible until 1 Aug 2025 provided the" +
                " condition remains stable.",
              helpText:
                "Vetcation time-stamps each video exam and tags the prescribed drug. If you try to refill that drug after the six-month window, the platform blocks the order and prompts you to schedule a new exam.",
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
                "If you store telemedicine session videos or chat logs, you must keep them secure — just like paper records in a physical clinic. This means using encrypted storage, limiting who can view them, and retaining them for the legally required duration.",
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
                "Our AI operates on secure, internal servers — no third-party cloud providers. We encrypt audio files and transcripts, then generate two separate documents: (1) a detailed medical record for the veterinarian’s files, and (2) a concise appointment summary for the client’s portal. Before the AI feature is enabled, Vetcation prompts you to confirm that the client has agreed to have their session recorded and processed, preventing any inadvertent privacy violations.",
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
      mainDescription: `California veterinarians must keep comprehensive medical records for
<span class="highlight">three years after the animal’s last visit or consultation</span>.
(BPC §§ 4855–4856; 16 CCR § 2032.3). The FAQs below reflect those
requirements and explain how Vetcation keeps you compliant.`,
      sections: [
        {
          id: "faqBasicRetention",
          title: "Retention Period",
          blocks: [
            {
              type: "qa",
              question: "How long must I retain medical records?",
              answer: `You must retain records for three years <span class="highlight">after the patient’s last visit. (BPC § 4856).</span>`,

              example:
                "If you treat a dog in Jan 2025 and never see it again, you may discard" +
                " the record in Jan 2028.",
              helpText:
                "Vetcation automatically tracks the last-visit date and tags records" +
                " for destruction reminders.",
            },
          ],
        },
        {
          id: "faqContentOfRecords",
          title: "Required Content (16 CCR § 2032.3)",
          blocks: [
            {
              type: "qa",
              question: "What details must be included?",
              answer:
                "Per <strong>Cal. Code Regs., tit. 16, § 2032.3(a)</strong>, every medical record must be legible and contain:<br>" +
                "(1) Name or initials of the person responsible for entries.<br>" +
                "(2) Name, address and phone number of the client.<br>" +
                "(3) Name or identity of the animal, herd or flock.<br>" +
                "(4) (Except for herds or flocks) age, sex, breed, species, and color of the animal.<br>" +
                "(5) Dates (beginning and ending) of custody of the animal, if applicable.<br>" +
                "(6) A history or pertinent information as it pertains to each animal, herd, or flock’s medical status.<br>" +
                "(7) Data, including that obtained by instrumentation, from the physical examination.<br>" +
                "(8) Treatment and intended treatment plan, including medications, dosages, <em>route of administration</em>, and <em>frequency of use</em>.<br>" +
                "(9) For surgical procedures: description of the procedure, name of the surgeon, sedative/anesthetic agents used, their route of administration, and strength if available in more than one strength.<br>" +
                "(10) Diagnosis or assessment prior to performing a treatment or procedure.<br>" +
                "(11) If relevant, a prognosis of the animal’s condition.<br>" +
                "(12) All medications and treatments prescribed and dispensed, including strength, dosage, route of administration, quantity, and frequency of use.<br>" +
                "(13) Daily progress, if relevant, and disposition of the case.",
              example: `
        <ul>
          <li><strong>Telehealth consult – 5 Apr 2025</strong></li>
          <li>(1) Entry by Dr. G. Chen (GC)</li>
          <li>(2) Client: Jane Smith, 123 Maple Ave, Los Angeles CA 90001; (310) 555-1234</li>
          <li>(3) Patient: “Buddy,” individual dog</li>
          <li>(4) Labrador Retriever, male/neutered, 4 yrs, yellow coat</li>
          <li>(5) Custody dates: 5 Apr 2025 – ongoing</li>
          <li>(6) History: 3-day left-ear discharge & scratching</li>
          <li>(7) Exam data: Otoscopic – erythematous canal, brown exudate; Temp 101.4 °F</li>
          <li>(8) Plan: Ear flush today; <strong>gentamicin-betamethasone otic drops</strong> 2 gtt AU <em>BID</em> × 7 d</li>
          <li>(9) N/A – no surgery performed</li>
          <li>(10) Diagnosis: Otitis externa (bacterial/yeast)</li>
          <li>(11) Prognosis: Good</li>
          <li>(12) Medication dispensed: gentamicin-betamethasone 5 mL; strength 3 mg/mL; 2 gtt AU BID × 7 d</li>
          <li>(13) Daily progress (Day 1): Owner reports mild pruritus; no adverse effects</li>
        </ul>
      `,
              helpText:
                "Vetcation’s note template maps one-to-one with each § 2032.3(a) item and prevents closure of a consult until all required fields are completed.",
            },
          ],
        },
        {
          id: "faqProvidingRecords",
          title: "Providing Records / Summaries",
          blocks: [
            {
              type: "qa",
              question: "Can I give a summary instead of the full record?",
              answer:
                "Yes. <strong>Cal. Code Regs., tit. 16, § 2032.3(b)</strong> states:<br>" +
                "• Records must be kept for <em>three years after the animal’s last visit</em>.<br>" +
                "• A summary of an animal’s medical records shall be made available to the client <em>within five (5) days</em>—or sooner if the animal is critical—upon request.<br>" +
                "The summary must include:<br>" +
                "(1) Name and address of client and animal.<br>" +
                "(2) Age, sex, breed, species, and color of the animal.<br>" +
                "(3) History or pertinent information as it pertains to the animal’s medical status.<br>" +
                "(4) Data, including that obtained by instrumentation, from the physical examination.<br>" +
                "(5) Treatment and intended treatment plan, including medications, their dosage and frequency of use.<br>" +
                "(6) All medications and treatments prescribed and dispensed, including strength, dosage, <em>route of administration</em>, quantity, and frequency of use.<br>" +
                "(7) Daily progress, if relevant, and disposition of the case.",
              example: `
        <ul>
          <li><strong>Client/Animal:</strong> Jane Smith, 123 Maple Ave, LA CA 90001 / “Buddy,” Labrador, M/N, 4 yrs, yellow</li>
          <li><strong>History:</strong> Three-day left-ear discharge & scratching</li>
          <li><strong>Exam data:</strong> Otoscopic—erythema, brown exudate; Temp 101.4 °F</li>
          <li><strong>Treatment plan:</strong> Ear flush today; <em>gentamicin-betamethasone drops</em>—strength 3 mg/mL; 2 gtt AU <em>BID × 7 d</em></li>
          <li><strong>Medications dispensed:</strong> Gentamicin-betamethasone 5 mL bottle; 2 gtt AU BID × 7 d (route: otic; quantity: 1 bottle)</li>
          <li><strong>Progress:</strong> Day 1—mild pruritus, no adverse effects</li>
          <li><strong>Disposition:</strong> Re-check video call in 1 week</li>
        </ul>
      `,
              helpText:
                "Vetcation’s >Export → Generate Summary tool auto-pulls every § 2032.3(b) element, inserts your e-signature, and produces a PDF. The timer ensures delivery within five days (or sooner if you mark the case critical).",
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
                "Can a California-licensed veterinarian continue providing telehealth to a pet that travels out of California?",
              answer:
                "No. A California license only authorizes telehealth services when the animal is physically in California. If the pet leaves California, only a veterinarian licensed in the state where the pet is located may provide telehealth— and only if that state’s laws permit it.",
              example:
                "<ul>" +
                "<li><strong>Scenario:</strong> Buddy travels with his owner from Los Angeles to Portland.</li>" +
                "<li><strong>CA Vet:</strong> Cannot continue telehealth consults while Buddy is in Oregon.</li>" +
                "<li><strong>OR Vet:</strong> May provide telehealth only if licensed in Oregon and if Oregon telehealth rules allow it.</li>" +
                "</ul>",
              helpText:
                "Vetcation’s scheduling and location checks block new telehealth bookings when the system detects the pet is outside California, ensuring only appropriately-licensed veterinarians can see the patient.",
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
                "A client calls you about their dog’s cough but you’ve never met the animal. Messaging guidance alone cannot establish a new VCPR — you’d either need to see the dog in person or conduct a live video exam before diagnosing or prescribing.",
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
                "Yes. If, at any point, you determine that a telehealth exam (even synchronous audio-video) is insufficient to meet the standard of care, you must advise the client to schedule an in-person visit. Telehealth is only permissible when it allows you to gather enough information to make safe, informed medical decisions. If that isn’t possible, continuing solely via telehealth would be inappropriate — and could subject you to disciplinary action if an error occurs. (BPC, § 4826.6, subd. (c).)",
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
                "Can I provide a telehealth-based second opinion directly to the client when another veterinarian already has a VCPR?",
              answer:
                "No—unless you fall within the limited shared-practice exception in 16 CCR § 2032.15 (e.g., you and the primary veterinarian work at the same physical location and you have full access to the chart). A veterinarian-to-veterinarian consult is always allowed, but giving advice or prescriptions directly to the owner requires you to establish your own VCPR.",
              example:
                "The primary vet emails you radiographs for input. You may discuss findings with that vet, but you may not video-chat with the owner or prescribe medication unless you first establish your own VCPR or the § 2032.15 exception applies.",
              helpText:
                "Vetcation supports true peer-to-peer consults by limiting direct client access until you open a compliant VCPR encounter.",
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
                "Is it legal to perform euthanasia or guide a client through it via telehealth?",
              answer:
                "No. Because controlled substances are involved and a VCPR formed solely by telehealth cannot support prescribing or administering those drugs, euthanasia must be performed in person under a valid in-person VCPR. (BPC § 4826.6(i)(6)).",
              example:
                "A rural client requests video guidance to administer pentobarbital. You must decline and refer them to an in-person service.",
              helpText:
                "If a client raises the request inside Vetcation, the system displays a canned message explaining that euthanasia requires an on-site veterinarian.",
            },
          ],
        },
        {
          id: "faqVetLocationRegistration",
          title: "Telehealth From an Unregistered Home Office",
          blocks: [
            {
              type: "qa",
              question:
                "Do I need a registered veterinary premises if I practice only by telehealth?",
              answer:
                `Under B&P § 4853(h), the location where you practice telehealth is exempt from the registration requirement <span class="highlight">only if</span> you satisfy <span class="highlight">all</span> of the following:<br>` +
                `1. You do <span class="highlight">not</span> perform any in-person examinations or treatments at that location;<br>` +
                `2. You keep <span class="highlight">no</span> veterinary drugs, medicines, appliances, or medical equipment there;<br>` +
                "3. You create, maintain, and store all medical records (per §§ 4855 & 4856) so they’re protected from unauthorized access, damage, or loss;<br>" +
                "4. Any electronic publication (e.g. your website) where you offer services must prominently display:<br>" +
                "&nbsp;&nbsp;&nbsp;a. Your name, contact information, and California license number;<br>" +
                "&nbsp;&nbsp;&nbsp;b. Instructions for clients to obtain copies of their medical records;<br>" +
                "&nbsp;&nbsp;&nbsp;c. A statement that clients may contact the Veterinary Medical Board with questions or complaints.<br>" +
                `If <span class="highlight">any</span> of these conditions aren’t met, you must register the location as a veterinary premises under §§ 4853(a)–(c).`,
              example: `<ul>
           <li><strong>Scenario:</strong> You consult exclusively via video from your home office.</li>
           <li>You never see patients in person there.</li>
           <li>You store no drugs or equipment on-site.</li>
           <li>All records are encrypted and access-controlled off-site.</li>
           <li>Your website footer shows: Dr. Jane Doe, DVM #12345; “For medical records requests, email records@example.com”; “Call the CA Veterinary Medical Board at (916) 515-5220 for questions.”</li>
         </ul>`,
              helpText:
                "Vetcation’s onboarding checks each § 4853(h) condition. If any fail, we guide you through submitting a premises-registration application to the Board—ensuring full compliance with state law.",
            },
          ],
        },
        {
          id: "faqClinicPremises",
          title: "Telehealth From a Registered Clinic",
          blocks: [
            {
              type: "qa",
              question:
                "Our clinic already has a California Premises Permit. Do our veterinarians need a separate registration to use Vetcation for telehealth?",
              answer: `No. When telehealth is delivered <span class="highlight">from an address that already holds a valid Veterinary Premises Permit</span>, the location is \u003cstrong\u003ealready\u003c/strong\u003e registered under B&P §§ 4853 (a)–(c). The § 4853(h) exemption is irrelevant because the clinic is not an unregistered site.`,
              example: `<ul>
        <li><strong>Scenario:</strong> Maple Veterinary Hospital (Premises #VET-1234) adds video visits via Vetcation.</li>
        <li>All telehealth sessions originate from the clinic building.</li>
        <li>No extra premises paperwork is required—the existing permit covers on-site, mobile, and telehealth care.</li>
      </ul>`,
              helpText:
                "During onboarding, clinic admins simply enter the existing Premises Permit number. Vetcation records the permit and allows all associated vets to begin video consults immediately.",
            },
          ],
        },
        {
          id: "faqMixedWorkflows",
          title: "Mixed Workflows: Clinic & Home Office",
          blocks: [
            {
              type: "qa",
              question:
                "What if I sometimes consult from the clinic and sometimes from my home office?",
              answer: `When you consult <span class="highlight">inside the registered clinic</span>, you are covered by that premises permit. When you consult <span class="highlight">from home</span>, your home office must either meet <strong>all</strong> four conditions in B&P § 4853(h) <em>or</em> be registered as a separate premises.`,
              example: `<ul>
        <li>Clinic shift   →  video visit from Maple Veterinary Hospital (covered under Premises #VET-1234).</li>
        <li>Evening shift  →  video visit from your home office.</li>
        <li>Home office complies with § 4853(h): no in-person exams, no drugs on site, cloud-based records, required footer posted.</li>
        <li>If you ever stock medications at home, the exemption is lost and a home-office premises registration is mandatory.</li>
      </ul>`,
              helpText:
                "Vetcation lets you tag each telehealth session with its originating location. If you select “Home Office,” the platform runs the § 4853(h) checklist; if any item fails, it warns you to register the site before scheduling new sessions.",
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
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8367.PNG?alt=media&token=2615e2aa-5d1b-4f61-9a6a-1a6afa0a48b1",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8372.PNG?alt=media&token=0e8a49c8-10f0-43ca-99da-902c91a17043",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%201.31.06%20PM.png?alt=media&token=0e2adb20-f48d-4e18-bdc7-0cf3854ad7ba",
              ],
            },
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
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%2011.12.55%20PM.png?alt=media&token=e653f8e4-4a3b-43b2-b8b4-6c8b33b0350f",
                // "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.25.35%20PM.png?alt=media&token=e7e6acaa-c25f-4a8f-9c29-9ad96b057021",
              ],
            },
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
                // "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%202.26.35%20PM.png?alt=media&token=a2c17838-bd95-459b-8920-76b75aa9d97a",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%2011.13.19%20PM.png?alt=media&token=086e22cd-ffcc-4028-a467-5e8b8b777788",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Access Telemedicine Info (top middle)",
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

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FScreen%20Shot%202025-04-01%20at%2011.14.13%20PM.png?alt=media&token=1cdeae5b-84ee-440f-b2d9-f92547699a60",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading:
                    "Access Inquiry-based Messager (bottom right corner)",
                  lines: [
                    "During a video call, you can use the inquiry-based Messager to send text messages to the client.",
                    "This feature is useful for sharing links, files, or other details that might be hard to convey verbally.",
                    "The chat is saved in the Inquiry-Based Messager, ensuring continuity of care.",
                    "For more details, see the 'Inquiry-Based Messager' section.",
                  ],
                },
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
                  heading: "Noise Cancellation",
                  lines: [
                    "Filters out ambient noise—like clinic chatter or traffic—so you and your client can focus on what matters.",
                    "Helpful if you’re on the move, in a busy setting, or simply want the clearest audio.",
                    "Noise Cancellation will automatically be enabled when you join a call.",
                  ],
                },
                {
                  heading: "Virtual Backgrounds",
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

    InquiryBasedMessagerOverView: {
      mainTitle: "Vetssenger Overview",
      mainDescription: `
        Vetssenger is Vetcation’s inquiry-based messaging tool designed to help you maintain continuous care and build healthy and lasting relationships with your clients.
      `,
      sections: [
        // NEW SECTION to hold the text previously in mainDescription
        {
          id: "vcprAndCases",
          title: "VCPR and Case Handling",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Vetssenger Threads",
                  lines: [
                    `Each <span class="highlight">Vetssenger thread</span> is dedicated to one veterinarian, one pet owner, and one patient (pet). <span class="highlight">Messaging through Vetssenger becomes available only after a valid VCPR has been established</span> (via an in-person or synchronous video visit per AB 1399).`,
                    `With a valid VCPR in place, either party can initiate a new <span class="highlight">case</span> (chat session) within the thread. Veterinarians can freely start cases, while pet owners pay a fee (set by you) to start a new inquiry—provided you are open to accepting questions.`,
                    `Click “Close Case” once the inquiry is fully addressed. All cases remain neatly organized in a single Vetssenger thread, ensuring easy reference and seamless continuity of care.`,
                  ],
                },
              ],
            },
          ],
        },

        // Existing section about navigating the tabs
        {
          id: "vetssengerTabs",
          title: "Navigating the Vetssenger Tabs",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8395.PNG?alt=media&token=fe15ea39-bc48-43c8-9d77-32a1dc3972a9",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8410.PNG?alt=media&token=5f0af2fc-83b8-4bf6-900a-cce62614318e",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Active Tab",
                  lines: [
                    "Shows all on-going cases that are still open.",
                    "These include any chat sessions that are awaiting your response or action.",
                    "Your goal is to review, respond to, and close all open cases in this tab to ensure timely communication and maintain your clients' satisfaction.",
                  ],
                },
                {
                  heading: "Archived Tab",
                  lines: [
                    "Displays all closed cases from past conversations.",
                    "You can revisit any previous case here to review history or context.",
                    `If further follow-up is needed, simply initiate a new case within the same thread from the Archived tab or use "+" to start a new case.`,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    VetssengerVCPRStatus: {
      mainTitle: "Vetssenger VCPR Status",
      mainDescription: `
        Vetssenger helps you deliver continuous care and maintain lasting relationships with your clients. To comply with California law (AB 1399), Vetssenger can only be used after establishing a valid VCPR through an in-person visit or synchronous video consultation. Pet owners will be unable to initiate new cases until this requirement is fulfilled.
      `,
      sections: [
        {
          id: "vcprStatus",
          title: "Understanding VCPR Status",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URL
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8387.PNG?alt=media&token=5a1d8b4c-6f4b-4f4e-8d3c-0a3e8e8f6c0c",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8393.PNG?alt=media&token=c717d3ad-b5f0-4a64-9248-ef3bcfb61628",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Check VCPR Status",
                  lines: [
                    `If a valid VCPR is established, you'll see "Connected" displayed on the right side of the banner.`,
                    `If a valid VCPR has expired, you'll see "Connected?" displayed instead.`,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    StartNewCase: {
      mainTitle: "Start a New Case",
      mainDescription: `
        Starting a new case in Vetssenger is easy and straightforward. Follow the steps below to initiate a new inquiry-based chat session with your client.
      `,
      sections: [
        {
          id: "startNewCase",
          title: "How to Start a New Case",
          blocks: [
            {
              type: "framedImage",

              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8386.PNG?alt=media&token=94c4eadf-538b-4d87-8322-606be6306b55",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8398.PNG?alt=media&token=2ce475e1-24e7-48ab-a35e-996944cdc2ad",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8397.PNG?alt=media&token=f0091f31-9b64-41af-8372-a022ca38f7d1",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Open Vetssenger",
                  lines: [
                    `Navigate to the chat tab at the bottom.`,
                    `Click the "+" icon at the bottom right to start a new chat.`,
                  ],
                },
                {
                  heading: "Initiate a New Case (Chat Session)",
                  lines: [
                    "On the left screen, you'll see all the fields required to start a new case. The first field is for selecting the client, and the second asks which pet the case is for.",
                    "When you tap the client input field, the middle screen appears—allowing you to choose from clients who have previously built a valid VCPR with you.",
                    "After selecting the client, the right screen displays all pets owned by that client.",
                    `Pets labeled with "Connected" indicate a valid VCPR has been established and can be selected.`,
                    `"Connect?" means you have not yet established a valid VCPR with that pet, and they cannot be selected.`,
                    "(Optional) You may also select a licensed technician who partners with you to join the session.",
                    "Enter the topic, title, and your initial message to begin the case.",
                    "Press the Send button to officially start the case.",
                    `If you click "X," your input will be saved as a draft.`,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    RespondToCase: {
      mainTitle: "Responding to a Vetssenger Case",
      mainDescription: `
        Responding to a case on Vetssenger indicates that you've agreed to handle the client's inquiry. Once you join a case, the pet owner is immediately charged the fee you set. Pet owners have the option to withdraw their inquiry before you join, in which case they won't be charged.
      `,
      sections: [
        {
          id: "respondToCase",
          title: "How to Respond to a Case",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8404-min.PNG?alt=media&token=6774e90a-ad3a-4f00-96b9-0c5e218dcfbb",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "View Pending Cases",
                  lines: [
                    "You’ll receive a notification when a new message arrives.",
                    "Go to your Vetssager inbox to review incoming inquiries.",
                    "Any case awaiting your response will display a small dot next to the message box — just like on Facebook Messenger.",
                    `All active unclosed cases will be listed in the Vetssenger "Active" inbox.`,
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8401-min.PNG?alt=media&token=8a2a1939-8f27-49b3-afcf-1c706f11cf91",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Review the Inquiry",
                  lines: [
                    "Select the inquiry to review the details provided by the pet owner.",
                    "You can see the topic, the initial message, and any related patient information.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8402-min.PNG?alt=media&token=bb4671da-9d5f-47ea-b1bf-812d2a967ffe",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8403-min.PNG?alt=media&token=d41a0732-c294-4f1c-89c4-235adc66d0f7",
              ],
            },

            {
              type: "bulletList",
              items: [
                {
                  heading: "Join the Case",
                  lines: [
                    "To accept and respond to the inquiry, type your message and press Send.",
                    "Once you join, the pet owner will be automatically charged the inquiry fee you've set.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8411-min.PNG?alt=media&token=09b1a50e-c47d-4d01-85ae-034ab96662bb",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Access closed Cases",
                  lines: [
                    "To view closed cases, go to the Vetssenger inbox and select the 'Archived' tab.",
                    "This allows you to review past inquiries and maintain continuity of care.",
                  ],
                },
              ],
            },

            {
              type: "bulletList",
              items: [
                {
                  heading: "Pet Owner Withdrawal",
                  lines: [
                    "Pet owners can withdraw their inquiry before you join the case.",
                    "If withdrawn before your response, they won't incur any charge.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    CloseCase: {
      mainTitle: "Closing a Vetssenger Case",
      mainDescription: `
        Once you've fully addressed a client's inquiry in Vetssenger, you can close the case. Vetssenger will automatically generate an AI summary of the conversation to help streamline your documentation process. You also have the flexibility to reopen a case if additional follow-up is needed.
      `,
      sections: [
        {
          id: "closingTheCase",
          title: "How to Close a Case",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8406-min.PNG?alt=media&token=f60d50fc-c3ed-4371-a691-5297eee83119",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8408-min.PNG?alt=media&token=2e2c2a99-dc04-4665-9c66-9ab39a98fb04",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Close the Case",
                  lines: [
                    `Click the "Close the Case" button at the top of the conversation once the inquiry has been fully resolved.`,
                    "After closing, the conversation will remain accessible for future reference.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8408-min.PNG?alt=media&token=2e2c2a99-dc04-4665-9c66-9ab39a98fb04",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8409-min.PNG?alt=media&token=1029e7c5-cfad-40bb-9211-c5953e2c2218",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "AI-Generated Summary",
                  lines: [
                    "Upon closing the case, Vetssenger automatically generates a concise summary based on your conversation.",
                    `To access this summary, click the "Medical Note" button. The AI-generated summary will appear below the note input field.`,
                    "You can copy this summary into your notes and edit as necessary to ensure accuracy.",
                  ],
                },
                {
                  heading: "Privacy of Medical Notes",
                  lines: [
                    "Medical notes are private and only visible to you.",
                    "Clients do not have access to these notes.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "reopeningCases",
          title: "Reopening a Closed Case",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8412-min.PNG?alt=media&token=d5d4d4b5-0cb1-438d-838b-892667b474ae",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8415-min.PNG?alt=media&token=fea08018-3fa2-475f-952e-879ccb76b258",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8416-min.PNG?alt=media&token=3aaa8771-bd38-4a76-816e-cfefca88acd0",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Reopen a Closed Case",
                  lines: [
                    "If you need to add more information or ask additional questions after closing, you can reopen the same case.",
                    "Pet owners can respond freely without incurring an additional charge when a case is reopened.",
                    `Once you've addressed any follow-up questions, click "Close Case" again to finalize the conversation.`,
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8417-min.PNG?alt=media&token=358f6f35-f270-49de-a507-cc7803e9e1f2",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Updated AI-Generated Summary",
                  lines: [
                    "After reclosing, Vetssenger will generate a new AI summary based on the updated conversation.",
                    "You can review and edit this new AI summary and copy it into your notes as needed.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    ViewCaseHistory: {
      mainTitle: "Viewing Case History",
      mainDescription: `
        Vetssenger makes it easy to review past cases with your clients. Quickly access and revisit previous inquiries for comprehensive and continuous care.
      `,
      sections: [
        {
          id: "howToViewCaseHistory",
          title: "How to View Case History",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8425-min.PNG?alt=media&token=06c970fc-6595-45d7-82ba-a19aea03fec5",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8426-min.PNG?alt=media&token=822aa65e-26d3-4687-bb8a-3301aca443c0",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Open Case History",
                  lines: [
                    `Within a Vetssenger thread, click the three-dot icon (⋯) located at the top-right corner of the chat.`,
                    `Select "View All Requests" from the dropdown menu to see a list of all previous cases related to this pet owner and patient.`,
                  ],
                },
                {
                  heading: "Navigate to Specific Case",
                  lines: [
                    "Browse through the list of previous cases.",
                    "Click on any case to navigate directly to that specific conversation.",
                    "Easily reference past interactions to support ongoing care and follow-up inquiries.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    VetssengerNotes: {
      mainTitle: "Vetssenger Notes",
      mainDescription: `
      Vetssenger Notes help you conveniently document key details from your telehealth consultations. 
      When you open the Medical Note screen, you’ll see an <span class="highlight">AI-generated summary</span> displayed just below the input field. 
      You can review, copy, and edit this draft to create your official note. 
      Once saved, your note will be stored for future reference, while the AI summary will not be saved.
    `,
      sections: [
        {
          id: "howToAccessNotes",
          title: "How to Access Vetssenger Notes",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8408-min.PNG?alt=media&token=2e2c2a99-dc04-4665-9c66-9ab39a98fb04",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8409-min.PNG?alt=media&token=1029e7c5-cfad-40bb-9211-c5953e2c2218",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Open the Latest Case Note",
                  lines: [
                    `Within a Vetssenger thread, tap "Medical Note" in the top banner to view the latest note for that case.`,
                  ],
                },
                {
                  heading: "Navigate to a Specific Note",
                  lines: [
                    "Each case note appears at the end of the corresponding conversation thread.",
                    `Alternatively, tap the three-dot menu (⋯) in the top-right corner of the chat, select the desired case, and then tap "Medical Note" to view it.`,
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    MedicalRecords: {
      mainTitle: "Viewing Medical Records",
      mainDescription: `
        Vetssenger allows you to easily access medical history for each patient to support informed, ongoing care.
      `,
      sections: [
        {
          id: "howToViewMedicalRecords",
          title: "How to View Medical Records",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8408-min.PNG?alt=media&token=2e2c2a99-dc04-4665-9c66-9ab39a98fb04",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8427-min.PNG?alt=media&token=8509c639-207e-459d-af0b-2b1c478f3c15",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Navigate to Medical Records",
                  lines: [
                    `Within a Vetssenger thread, click the "View Medical Records" button located on the top banner.`,
                    `You’ll be taken to a detailed history of the patient’s past medical records.`,
                  ],
                },
                {
                  heading: "Privacy and Access Control",
                  lines: [
                    "Medical records are securely stored under your virtual clinic's account.",
                    "Only you (the assigned veterinarian) and the pet owner have access to this data—no other parties can view these records.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    MedicalHistoryOverview: {
      mainTitle: "Medical History Overview",
      mainDescription: `
        The Medical History section gives you and the pet owner access to important health information in one place. 
        You can view patient details such as <span class="highlight">breed, color, sex, date of birth, spayed/neutered status, and weight history</span>. 
        You may also export the full medical history, which pet owners can take to their home clinic when needed.
      `,
      sections: [
        {
          id: "visits",
          title: "Visits",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8427-min.PNG?alt=media&token=8509c639-207e-459d-af0b-2b1c478f3c15",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "All Appointments in One Place",
                  lines: [
                    "See all past and upcoming visits with your virtual clinic.",
                    "Each entry includes the date, time, and reason for the visit, helping you track the patient’s care timeline.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "records",
          title: "Records",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8432-min.PNG?alt=media&token=b2e4620a-d057-48d1-95e5-1286039fd5ee",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8437-min.PNG?alt=media&token=fcca1ddc-be16-4cd1-8048-7783eba869e3",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Comprehensive Visit Records",
                  lines: [
                    `Press "+" to add a new record including <span class="highlight">Data, Assessment, and Plan</span>, <span class="highlight">prescriptions</span>, and <span class="highlight">general notes.</span>`,
                    "This section is designed to keep all DAP, prescriptions, and notes organized and easily accessible.",
                    "Owners can upload medical records from their in-clinic visits, which will appear here for unified documentation.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "weightChart",
          title: "Weight Chart",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8432-min.PNG?alt=media&token=b2e4620a-d057-48d1-95e5-1286039fd5ee",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8433-min.PNG?alt=media&token=51cecb79-1400-4852-9f35-51d6e5085b1d",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Track Growth and Health Trends",
                  lines: [
                    `Press "see chart" to view the pet's weight chart.`,
                    "See the pet’s weight trends over time in a visual chart.",
                    "Useful for monitoring young pets, managing chronic conditions, or evaluating treatment progress.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    DAP: {
      mainTitle: "Data, Assessment, Plan (DAP)",
      mainDescription:
        "Vetcation’s DAP template is designed to empower your virtual clinic by streamlining record-keeping while enhancing client communication. Tailored for California-licensed veterinarians, it captures every detail of your telehealth sessions—from a thorough history and live observations to clear, actionable next steps. With a format that mirrors the high standards of in-person care, you can deliver flexible, legally compliant care from anywhere while keeping your practice audit-ready.",
      sections: [
        {
          id: "dapTemplate",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8436-min.PNG?alt=media&token=411c4e80-0574-45db-8b51-861347869779",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8610-min.PNG?alt=media&token=d6d72496-acd5-482c-b536-5473434f2404",
              ],
            },
          ],
        },
        {
          id: "data",
          title: "Data",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Subjective Data",
                  lines: [
                    "Gather a comprehensive history by asking open-ended questions and truly listening to the pet owner’s concerns.",
                    "Document the chief complaint, noting when it started, how it has evolved, and any prior interventions.",
                    "Cover key areas such as changes in eating, drinking, bathroom habits, and overall energy levels, along with past medical history and lifestyle details.",
                  ],
                },
                {
                  heading: "Objective Data",
                  lines: [
                    "Perform a detailed virtual assessment, guiding the pet owner to help you observe physical signs such as gum color, capillary refill time, and skin turgor.",
                    "Record both normal and abnormal findings to create a well-rounded picture of the pet's current health.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "assessment",
          title: "Assessment",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Diagnosis or Differential Diagnoses",
                  lines: [
                    "Summarize your clinical impressions or list differential diagnoses based on the data gathered.",
                    "For telemedicine consultations, provide suspected conditions in a way that aligns with legal guidelines and your professional standards.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "plan",
          title: "Plan",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Actionable Next Steps",
                  lines: [
                    "Provide clear treatment recommendations, prescriptions, or general care advice tailored to your telehealth service type.",
                    "Outline follow-up instructions, including when to monitor symptoms and when to seek in-person care.",
                    "For teletriage, specify the urgency of care needed while reminding clients they can opt for sooner in-person care if necessary.",
                  ],
                },
                {
                  heading: "Communication Pro Tips",
                  lines: [
                    "Complete your records promptly after the appointment to ensure accuracy.",
                    "Draft your plan in a personal yet professional message to the client, then seamlessly integrate it into the record.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    noteforclient: {
      mainTitle: "Note for Client",
      mainDescription:
        "The Note function on Vetcation allows you to add extra details that don't fit into the standard medical record. Keep in mind that clients are not notified when notes are added, so if you want them to be aware, make sure to send a direct message.",
      sections: [
        {
          id: "noteForClient",

          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                // Replace with your actual screenshot URLs

                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8435-min.PNG?alt=media&token=165ef6a5-66ff-4422-ba0f-abec6e0abadc",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8611-min.PNG?alt=media&token=ac48a8f1-033f-42e0-b0a5-7dc6909e4a2e",
              ],
            },
          ],
        },
      ],
    },

    addprescription: {
      mainTitle: "Add Prescription",
      mainDescription:
        "At Vetcation, we believe veterinarians and pet parents should have the freedom to choose how and where prescriptions are filled — without hidden fees or restrictive pharmacy policies. In California, AB 1399 requires veterinarians to offer written prescriptions and inform clients they may fill them at a pharmacy of their choice or directly through the prescriber. Our platform fully supports this by integrating with a wide range of online and local pharmacies, helping you deliver affordable, convenient care while staying compliant.",
      sections: [
        {
          id: "ourApproach",
          title: "Our Approach",
          blocks: [
            {
              type: "paragraph",
              text: "While some platforms steer prescriptions toward specific pharmacies or tack on extra fees, Vetcation takes a different path. We focus on transparency and flexibility, giving you full control to choose the most appropriate pharmacy, whether it’s online or local, so your clients always get the best value and care.",
            },
          ],
        },
        {
          id: "pharmacyOptions",
          title: "Pharmacy Options",
          blocks: [
            {
              type: "paragraph",
              text: "Vetcation is designed to give you and your clients complete pharmacy freedom. We integrate with a growing network of online and local pharmacies, including Mixlab, Chewy, Vetsource, and neighborhood pharmacies, so you can easily choose the most convenient, affordable, or trusted option for each prescription. There are no additional platform fees, and you're always free to select what works best for your client.",
            },
          ],
        },
        {
          id: "howItWorks",
          title: "How It Works (we use Mixlab as an example)",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8607-min.PNG?alt=media&token=58dfd464-ceb6-4ae6-a57d-a611b1b2f1b3",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8608-min.PNG?alt=media&token=1f921da1-4099-4007-8600-f6f7ab94ef3d",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Step 1: Search the Mixlab Catalog",
                  lines: [
                    "Use the ProductSearchScreen to search and select medications from Mixlab's full product catalog.",
                    "The screen filters out controlled substances for telemedicine to ensure compliance with AB 1399.",
                  ],
                },
                {
                  heading: "Step 2: Customize Your Prescription",
                  lines: [
                    "Once selected, use the PrescriptionDetailsScreen to modify key values such as the prescribed quantity.",
                    "For compound medications, you can also edit the strength if a custom dosage is needed.",
                  ],
                },
                {
                  heading: "Step 3: Submit to Mixlab",
                  lines: [
                    "After reviewing the details, submit your prescription directly to Mixlab.",
                    "Mixlab processes the order and handle the rest, including contacting the pet owner for payment and delivery.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "additionalTips",
          title: "Additional Tips for a Smooth Process",
          blocks: [
            {
              type: "paragraph",
              text: "When communicating prescription details, confirm contact and delivery information during the virtual visit. This helps reduce delays and surprises, especially for urgent medications. If your client opts for online fulfillment, remind them to set up an account and request the prescription so you can easily confirm it with the pharmacy. By keeping your workflow transparent and flexible, you can offer more affordable medication options without compromising care.",
            },
          ],
        },
      ],
    },

    pharmacys: {
      mainTitle: "Pharmacy Options for California",
      mainDescription:
        "If you are licensed in California and operating under a virtual VCPR, you may wish to prescribe for your patient following the appointment. While we continue to enhance our platform, here are some effective options to help ensure smooth and efficient prescription fulfillment for both you and your client:",
      sections: [
        {
          id: "humanPharmacy",
          title: "Human Pharmacy (including Costco and Walmart)",
          blocks: [
            {
              type: "paragraph",
              text: "If the medication can be filled by a human pharmacy and the pet owner prefers to pick it up in person, this is often the fastest option for urgent care. After the appointment, you can send a digital prescription to the pet owner, who may visit a local pharmacy (such as Costco or Walmart) to check availability. If the pharmacy confirms they have the medication, the pet owner can enter the pharmacy’s email address into our system. The Vetcation platform will then immediately email the prescription directly to the pharmacy—along with your license, contact information, and professional details—ensuring your personal information is only shared with the pharmacy, not the pet owner.",
            },
          ],
        },
        {
          id: "mixlab",
          title: "Mixlab",
          blocks: [
            {
              type: "paragraph",
              text: "Mixlab is fully integrated into the Vetcation platform, allowing you to search their product catalog and prescribe directly through our system—no phone calls or emails needed. Once you submit a prescription, Mixlab will automatically contact the pet owner to confirm payment and arrange delivery. In most cases, delivery is completed within 24–36 hours, and same-day delivery is available in the Los Angeles area. This streamlined workflow saves time and ensures fast, reliable access to veterinary-labeled and compounded medications.",
            },
          ],
        },
        {
          id: "chewy",
          title: "Chewy",
          blocks: [
            {
              type: "paragraph",
              text: "We are currently working with Chewy to integrate direct prescribing into our platform, expected to be available in the coming month. Until then, if a client prefers to use Chewy, they must first request the medication through their Chewy account. You would then be required to contact Chewy to verify the prescription. This process can be more manual and may delay fulfillment, making it less ideal for urgent needs.",
            },
          ],
        },
        {
          id: "vetsource",
          title: "Vetsource (Coming Soon)",
          blocks: [
            {
              type: "paragraph",
              text: "We are actively working on integrating Vetsource into the Vetcation platform to provide an additional trusted option for fulfilling prescriptions. This will further expand your ability to serve clients through the pharmacy of their choice.",
            },
          ],
        },
        {
          id: "additionalConsiderations",
          title: "Additional Prescribing Considerations",
          blocks: [
            {
              type: "paragraph",
              text: "After your California appointment, clearly communicate the next steps to the pet owner to ensure smooth prescription fulfillment. Do not email the prescription pad PDF directly to the client, as it includes your personal information and cannot be used by pharmacists for verification.",
            },
          ],
        },
      ],
    },
    CommunityMarketing: {
      mainTitle: "Community Marketing",
      mainDescription:
        "For veterinarians looking to market their expertise, Vetcation’s community Q&A section provides a space to connect with pet owners who have questions about their pets and to share your professional knowledge. Through general advice or teletriage, you can offer valuable educational insights about common pet health topics or help pet owners assess the urgency of their pets' conditions by commenting on their questions. The information you share will be seen by many other pet owners who care deeply about their pets, helping you increase your visibility and ultimately drive more appointments.",
      sections: [
        {
          id: "generaladvice",
          title: "General advice & teletriage",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_7383_compressed.png?alt=media&token=4f4cc1eb-073b-4a46-acba-1dedd89943ad",
              ],
            },
            {
              type: "qa",
              question: "What is general advice?",
              answer:
                "General advice means sharing educational guidance and insights about pet health topics publicly, without providing a specific diagnosis or treatment plan. When answering questions in the Vetcation Community Q&A, veterinarians can offer valuable information about common symptoms, diagnostic possibilities, typical treatment expectations, outcomes, and general recommendations. This approach allows you to share your veterinary knowledge freely, help pet parents become more informed and proactive caregivers, and showcase your expertise publicly—effectively marketing your professional services without establishing a formal Veterinary-Client-Patient Relationship (VCPR).",
            },
            {
              type: "qa",
              question: "What is teletriage?",
              answer:
                "Teletriage involves remotely assessing the urgency of a pet's condition to help pet parents determine the most appropriate next steps, such as immediate emergency care, scheduling a veterinary visit, or monitoring at home. On Vetcation's Community Q&A, teletriage means providing general guidance on urgency and potential next steps without diagnosing or prescribing treatments. By offering teletriage, veterinarians can quickly assist pet parents in decision-making, build trust, and demonstrate their expertise, all without establishing a formal Veterinary-Client-Patient Relationship (VCPR).",
            },
          ],
        },
      ],
    },
    partnerWithClinic: {
      mainTitle: "Partner with a Clinic",
      mainDescription:
        "The Vetcation platform enables you to collaborate with brick-and-mortar clinics to offer virtual care under your own name and schedule. Their clients can view your availability, and medical records are shared to support continuity of care. There are no obligations or minimum time commitments—simply make your availability visible to their clients.",
      sections: [
        {
          id: "partnerWithClinic",
          title: "How to Partner with a Clinic",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8644-min.PNG?alt=media&token=13e52f49-7c58-49b2-95f6-89a828cb0f03",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8645-min.PNG?alt=media&token=8e3a0af7-cbfc-4ed1-8d60-0157fface6f6",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Search for a Clinic & Request Partnership",
                  lines: [
                    "Search the clinic you want to partner with in the Vetcation app.",
                    "Once you find the clinic, request to partner with them.",
                    "The clinic will receive a notification and can approve or deny your request.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8647-min.PNG?alt=media&token=c24c7a21-f9be-49cd-910e-474443eef671",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8648-min.PNG?alt=media&token=95228e62-767b-448a-828c-308c19f6e775",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Approval Process",
                  lines: [
                    "Once the clinic approves your request, you will receive a notification.",
                    "You will see your profile listed under the clinic's profile.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8649-min.PNG?alt=media&token=07bb5e7a-bf85-440f-ab0c-da7c178b78d1",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Visibility to Clients:",
                  lines: [
                    "When a clinic's client searches for a telemedicine doctor, your profile will display the name of the partnered clinic that matches the client’s designated home clinic. This ensures proper visibility and medical record sharing.",
                    "The above screen shows an example from a client's view, where their home clinic (LA Veterinary Center) is partnered with a telemedicine doctor.",
                    "The Vetcation system prioritizes doctors partnered with the client’s home clinic over other telemedicine doctors.",
                    "After the appointment, the medical records will be shared with the partnered clinic.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  // the following is used for show what case examples are suituable for telemedicine, so that vets can understand the concept and benefit of telemedicine right away, we will start with general cases, then more specific example for GP, dermatology, behavior, oncology, internal medicine, nutrition
  telemedicineCases: {
    telemedicineCasesOverview: {
      mainTitle: "Telemedicine Case Examples",
      mainDescription:
        "A simple triage map for where telemedicine fits, what vets can do remotely, and when to route in-person.",
      sections: [
        {
          id: "generalCases",
          title: "Where Telemedicine Fits",
          blocks: [
            // {
            //   type: "paragraph",
            //   text: "Legend — Fit: <strong>Strong</strong> • <strong>Often</strong> • <strong>Limited/No</strong>",
            // },
            {
              type: "table",
              caption: "At-a-glance suitability by case type",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: true,
              minWidth: "840px",
              columns: [
                { key: "case", title: "Case", width: "22%" },
                {
                  key: "fit",
                  title: "Fit",
                  format: "pill",
                  align: "center",
                  width: "12%",
                },
                {
                  key: "help",
                  title: "How vets help (remotely)",
                  width: "34%",
                },
                {
                  key: "escalate",
                  title: "Escalate in-person if…",
                  width: "32%",
                },
              ],
              rows: [
                {
                  case: "Behavior (aggression, litter box, anxiety)",
                  fit: "Strong",
                  help: "Home-context review, plan, trainer coordination, follow-ups.",
                  escalate: "Immediate safety risks; neuro red flags",
                },
                {
                  case: "Skin/derm (rash, itch, hotspots)",
                  fit: "Strong",
                  help: "Photo/video review, topicals/meds, flare control.",
                  escalate: "Deep/infected wounds; procedure likely",
                },
                {
                  case: "Allergies",
                  fit: "Strong",
                  help: "Flare control, diet trials, med adjustments (where allowed).",
                  escalate: "Systemic reactions; airway involvement",
                },
                {
                  case: "Nutrition & weight",
                  fit: "Strong",
                  help: "Diet selection, weight-loss plan, coaching.",
                  escalate: "Rapid unexplained weight loss",
                },
                {
                  case: "Puppy/kitten wellness & training",
                  fit: "Strong",
                  help: "Preventive counseling, schedules, training tips.",
                  escalate: "Vaccines/exams/procedures are in-person",
                },
                {
                  case: "General health Q&A & follow-ups",
                  fit: "Strong",
                  help: "Care plans, med rechecks, monitoring.",
                  escalate: "Hands-on exam/tests required",
                },
                {
                  case: "GI (vomiting/diarrhea, mild)",
                  fit: "Often",
                  help: "Hydration/diet plan; warning signs; follow-up.",
                  escalate: "Severe, persistent, bloody, painful, lethargy",
                },
                {
                  case: "Minor cuts & wounds",
                  fit: "Often",
                  help: "Clean-care guidance; monitor; suture referral if needed.",
                  escalate: "Large/deep wounds; uncontrolled bleeding",
                },
                {
                  case: "Chronic disease mgmt (SAIM, arthritis, etc.)",
                  fit: "Often",
                  help: "Titration, lifestyle coaching, remote checks.",
                  escalate: "Decompensation; new neuro/resp signs",
                },
                {
                  case: "Post-op/checks (incision, meds, activity)",
                  fit: "Often",
                  help: "Incision review via photo/video; plan adherence.",
                  escalate: "Dehiscence, infection, uncontrolled pain",
                },
                {
                  case: "Medication refills/adjustments",
                  fit: "Often",
                  help: "Assess response/side effects; adjust within rules.",
                  escalate: "New/worsening adverse effects",
                },
                {
                  case: "Acute medical concerns (triage)",
                  fit: "Often (triage)",
                  help: "Urgency check; first-aid guidance; next steps.",
                  escalate:
                    "Breathing trouble, collapse, severe pain/bleeding, suspected blockage",
                },
                {
                  case: "Emergencies (trauma, seizures, bloat, dystocia)",
                  fit: "Limited/No",
                  help: "Immediate ER routing; safety instructions.",
                  escalate: "All of the above → ER now",
                },
              ],
              note: "California (vet-facing): patient located in CA; VCPR may be established via live audio-video; after VCPR, use telehealth as appropriate. Tele-VCPR prescriptions valid up to 6 months per exam; antimicrobials typically ≤14 days unless in-person exam; controlled substances/xylazine require in-person exam; honor pharmacy-of-choice on request.",
            },
          ],
        },
      ],
    },
    generalPracticeTelemedicine: {
      mainTitle: "Telemedicine: General Practice (California AB 1399)",
      mainDescription:
        "When utilizing telemedicine in general practice, it's important to consider specific guidelines and best practices to ensure effective and compliant care. Here are some key considerations:",
      sections: [
        {
          id: "gpTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These are primary-care problems that a California-licensed GP can typically diagnose and manage by live video under AB 1399, then e-prescribe to the client’s chosen pharmacy.",
            },
            {
              type: "table",
              caption:
                "GP cases commonly completed via telemedicine (with e-pharmacy options)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (GP)" },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: `Allergic itch / atopic flare (no infection signs)
                 <a href="https://ctajournal.biomedcentral.com/articles/10.1186/s40575-015-0014-5" target="_blank" rel="noopener">ICADA guideline</a>`,
                  plan: "Photo review, itch scoring, environment control, pruritus plan.",
                  rx: "Oclacitinib; short steroid taper when appropriate; topical antipruritics.",
                  red: "Pustules/crusts, fever, otitis with discharge, spreading lesions.",
                },
                {
                  case: `Flea allergy or gaps in parasite control
                 <a href="https://capcvet.org/guidelines/general-guidelines/" target="_blank" rel="noopener">CAPC prevention</a>`,
                  plan: "Exposure history, home vector-control coaching.",
                  rx: "Isoxazolines (flea/tick prevention).",
                  red: "Pale gums/anemia, heavy infestation in neonates or debilitated pets.",
                },
                {
                  case: `Mild acute GI upset (bright/alert; no blood)
                 <a href="https://wsava.org/wp-content/uploads/2025/01/Acute-Diarrhoea.pdf" target="_blank" rel="noopener">WSAVA acute diarrhea</a>`,
                  plan: "Hydration + bland diet; anti-nausea/anti-diarrheal; clear return precautions.",
                  rx: "Maropitant; GI protectants/probiotics; electrolytes.",
                  red: "Repeated vomiting, blood, pain, lethargy, dehydration.",
                },
                {
                  case: `Motion sickness / travel anxiety
                 <a href="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3bc065ce-09d6-4131-a5a0-dca3909e0bc8" target="_blank" rel="noopener">Cerenia label</a>
                 <a href="https://www.merckvetmanual.com/multimedia/table/common-drugs-used-to-treat-behavior-problems-in-dogs" target="_blank" rel="noopener">Trazodone (Merck Vet Manual)</a>`,
                  plan: "Trip plan, test-dose guidance, safety counseling.",
                  rx: "Maropitant for motion sickness; trazodone (non-controlled) for situational anxiety as appropriate.",
                  red: "Severe sedation, vomiting that persists despite therapy.",
                },
                {
                  case: `Mild upper-airway signs (no distress)
                 <a href="https://www.msdvetmanual.com/generalized-conditions/respiratory-diseases-of-dogs/overview-of-respiratory-diseases-in-dogs" target="_blank" rel="noopener">MSD: canine respiratory overview</a>`,
                  plan: "History, home monitoring, humidification, supportive care.",
                  rx: "Antihistamines; lubricating drops/nasal saline when appropriate.",
                  red: "Dyspnea, cyanosis, progressive cough with distress.",
                },
                {
                  case: `Osteoarthritis flare (stable patient)
                 <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2022-pain-management/resources/2022-aaha-pain-management-guidelines-for-dog-and-cats_updated_060622.pdf" target="_blank" rel="noopener">AAHA pain guidelines</a>`,
                  plan: "Pain scoring, activity plan, joint-support counseling.",
                  rx: "NSAID refill/adjustment if recent labs available; joint nutraceuticals.",
                  red: "Severe pain, non-weight-bearing, neuro deficits → imaging/exam.",
                },
                {
                  case: `Behavior: separation-related distress / noise sensitivity
                 <a href="https://www.merckvetmanual.com/multimedia/table/common-drugs-used-to-treat-behavior-problems-in-dogs" target="_blank" rel="noopener">Merck behavior meds</a>`,
                  plan: "History-heavy consult, home video review, behavior plan; trainer referral.",
                  rx: "Fluoxetine (SSRI) or trazodone as appropriate (non-controlled).",
                  red: "Bite risk/aggression escalation; neuro red flags.",
                },
                {
                  case: `Superficial hot spots (no deep infection)
                 <a href="https://www.merckvetmanual.com/integumentary-system/pyoderma/pyoderma-in-dogs-and-cats" target="_blank" rel="noopener">MSD: pyoderma/hot spots</a>`,
                  plan: "Clip/clean at-home instructions; close photo follow-up.",
                  rx: "Topical antiseptic/steroid mousse/gel; short anti-pruritic course.",
                  red: "Spreading cellulitis, purulent discharge, pain/fever.",
                },
                {
                  case: `Nutrition & weight management
                 <a href="https://wsava.org/wp-content/uploads/2020/01/Global-Nutrition-Guidelines-2013.pdf" target="_blank" rel="noopener">WSAVA nutrition</a>`,
                  plan: "Dietary assessment, caloric plan, recheck schedule.",
                  rx: "Therapeutic diet enrollment; omega-3 supplements.",
                  red: "Rapid unexplained weight loss → diagnostics.",
                },
                {
                  case: `Post-op or chronic condition check-ins (stable)
                 <a href="https://www.aaha.org/resources/2022-aaha-pain-management-guidelines-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA follow-up & monitoring</a>`,
                  plan: "Photo/video wound checks; medication refills when appropriate; return precautions.",
                  rx: "Non-controlled maintenance meds per plan; topical care supplies.",
                  red: "Dehiscence, fever, uncontrolled pain, draining tracts.",
                },
              ],
              note: "AB 1399 permits establishing a VCPR by real-time audio-video; prescriptions via telehealth are allowed in accordance with federal regulations and are limited to 6 months before re-examination. Clients must be told they may choose any pharmacy, and on request you must submit to their chosen pharmacy. See the California VMB FAQ and statute links below.",
            },
          ],
        },
        {
          id: "gpTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "These are GP problems where a video exam can start the workup/plan, then a partner clinic completes a procedure or test. Vetcation routes orders and summaries so the clinic team documents supervision correctly and results sync back to the GP and the client’s primary DVM.",
            },
            {
              type: "table",
              caption: "Start via telemedicine; complete at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (GP)" },
                { key: "clinic", title: "Clinic tasks & supervision" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: `Allergic dermatitis needing Cytopoint injection
                 <a href="https://ctajournal.biomedcentral.com/articles/10.1186/s40575-015-0014-5" target="_blank" rel="noopener">ICADA guideline</a>`,
                  tele: "Video exam, rule-in pruritus, document VCPR, place clinic order.",
                  clinic:
                    "RVT administers Cytopoint SC under indirect DVM supervision (on-premises).",
                  notes:
                    "Relief within 24–48h; record sync to GP and primary DVM.",
                },
                {
                  case: `Suspected otitis externa (discharge/pain)
                 <a href="https://www.merckvetmanual.com/ear-disorders/otitis-externa/otitis-externa-in-animals" target="_blank" rel="noopener">MSD: otitis externa</a>`,
                  tele: "History; photo/video of pinna/ear canal; analgesia plan; schedule clinic cytology.",
                  clinic:
                    "Ear cytology + flush; RVT tasks as permitted; DVM finalizes Dx/Rx.",
                  notes:
                    "Targeted topical therapy after cytology; recheck by photo/video.",
                },
                {
                  case: `Suspected UTI
                 <a href="https://iscaid.org/iscaid-guidelines" target="_blank" rel="noopener">ISCAID UTI guidance</a>`,
                  tele: "History, risk screen, analgesia/hydration plan, order urinalysis ± culture.",
                  clinic:
                    "Cystocentesis sample collection and lab submission; DVM reviews results.",
                  notes:
                    "If antibiotics indicated, Rx per results; antimicrobial stewardship applies.",
                },
                {
                  case: `Endocrine monitoring (hypothyroid, stable diabetes)
                 <a href="https://www.aaha.org/resources/2022-aaha-pain-management-guidelines-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA monitoring</a>`,
                  tele: "Dose/clinical review, lab order set, monitoring plan; schedule clinic bloodwork.",
                  clinic:
                    "Blood draw (RVT/assistant as permitted) and lab processing; DVM interprets.",
                  notes: "Adjust dose based on labs; follow-up by video.",
                },
                {
                  case: `Lameness needing radiographs
                 <a href="https://www.aaha.org/resources/2022-aaha-pain-management-guidelines-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA pain/lameness</a>`,
                  tele: "Gait video review, pain plan, imaging order, sedation risk screen if needed.",
                  clinic:
                    "Radiographs performed per supervision requirements; DVM reads/plan.",
                  notes:
                    "Tele follow-up for medical management; in-person for procedures if indicated.",
                },
              ],
              note: "Example workflow: Monday video visit → GP orders Cytopoint 20 mg SC at Partner Clinic A. Clinic logs indirect supervision by Dr. Smith; RVT Jones administers. Administration record syncs back to the tele-GP chart and the client’s primary DVM.",
            },
          ],
        },
      ],
    },
    dermatologyTelemedicine: {
      mainTitle: "Telemedicine: Dermatology — Clinical Considerations (DACVD)",
      mainDescription:
        "Example dermatologist-managed problems that are well-suited to live audio-video care, with examples of red flags that should prompt in-person evaluation. Links in each case point to an authoritative reference.",
      sections: [
        {
          id: "dermTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These are conditions a board-certified dermatologist (or dermatology-savvy DVM) can commonly manage by video with photo review, then e-prescribe to the client’s chosen pharmacy under AB 1399.",
            },
            {
              type: "table",
              caption:
                "Dermatology cases commonly completed via telemedicine (with e-pharmacy options)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (Derm DVM)" },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Atopic dermatitis (pruritic flare without infection signs) <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0514-6" target="_blank" rel="noopener">ICADA guideline</a>',
                  plan: "Structured pruritus history (seasonality, distribution), flare-control plan, recheck cadence; discuss allergy testing only when planning immunotherapy.",
                  rx: "Oclacitinib; short topical or oral glucocorticoid taper when appropriate; moisturizing/anti-itch topical adjuncts.",
                  red: "Pustules/crusts/epidermal collarettes, erosions/ulcers, fever, otitis with discharge.",
                },
                {
                  case: 'Flea allergy dermatitis & ectoparasite gap counseling <a href="https://www.msdvetmanual.com/integumentary-system/fleas-and-flea-allergy-dermatitis/flea-allergy-dermatitis-in-dogs-and-cats" target="_blank" rel="noopener">MSD Vet Manual</a>',
                  plan: "Exposure review, home vector control, year-round prevention education.",
                  rx: "Isoxazolines (flea/tick prevention); environmental control guidance.",
                  red: "Pale mucous membranes/anemia, heavy infestations in neonates/debilitated pets; secondary infection.",
                },
                {
                  case: 'Allergy education & maintenance (environmental/food) <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0513-7" target="_blank" rel="noopener">ICADA (diet trial)</a>',
                  plan: "Diet trial roadmap (if indicated), trigger avoidance, bathing regimen coaching; set expectations for timelines.",
                  rx: "Therapeutic diet enrollment (if doing elimination trial); antiseborrheic/conditioning shampoos; barrier sprays/wipes.",
                  red: "Weight loss, GI blood, non-resolving lesions despite strict trial.",
                },
                {
                  case: 'Contact/irritant dermatitis (mild, localized, known trigger) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/resources/2023-aaha-management-of-allergic-skin-diseases-guidelines.pdf" target="_blank" rel="noopener">AAHA 2023</a>',
                  plan: "Trigger identification, avoidance plan, adjunctive skin barrier support.",
                  rx: "Short course topical corticosteroid; bland emollients; barrier creams.",
                  red: "Rapid spread, ulceration, severe pain, systemic signs.",
                },
                {
                  case: 'Maintenance rechecks after prior in-person workup (e.g., Malassezia dermatitis, pyoderma resolved) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5603939/" target="_blank" rel="noopener">Malassezia review</a>',
                  plan: "Photo review to confirm remission/maintenance; reinforce bathing intervals and recheck triggers.",
                  rx: "Topical antifungal/antiseptic shampoos/wipes per prior plan; omega-3; moisturizers.",
                  red: "Recurrent lesions suggesting active infection → in-clinic cytology/culture.",
                },
                {
                  case: 'Paw-care regimen for environmental exposure (interdigital irritation without infection signs) <a href="https://www.msdvetmanual.com/integumentary-system/interdigital-furunculosis/interdigital-furunculosis-in-dogs" target="_blank" rel="noopener">Interdigital furunculosis (MSD)</a>',
                  plan: "Footbath protocol, after-walk rinse, drying routine; monitor with photos.",
                  rx: "Antiseptic/soothing foot soaks; barrier sprays; booties during flares.",
                  red: "Swelling, draining tracts, lameness → in-person exam (rule out furunculosis).",
                },
                {
                  case: 'Seborrheic disorders (mild scaling/greasy coat without infection signs) <a href="https://www.msdvetmanual.com/integumentary-system/seborrhea/seborrhea-in-animals" target="_blank" rel="noopener">MSD Vet Manual</a>',
                  plan: "Shampoo plan (antiseborrheic/keratolytic), rinse/condition routine; evaluate nutrition & environment.",
                  rx: "Keratolytic/keratoplastic shampoos; humectants/emollients.",
                  red: "Odor, pustules, erythema suggesting infection → cytology.",
                },
                {
                  case: 'Otic maintenance recheck (post-cytology case now clinically quiet) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/resources/2023-aaha-management-of-allergic-skin-diseases-guidelines.pdf" target="_blank" rel="noopener">AAHA 2023</a>',
                  plan: "Owner-captured video/lighting tips; cleaner technique reinforcement; define relapse triggers.",
                  rx: "Ear cleaners/drying agents; short anti-inflammatory otic steroid only if no discharge/pain.",
                  red: "Discharge, pain, head tilt, neuro signs → in-clinic otoscopy/cytology.",
                },
                {
                  case: 'Seasonal pre-emptive flare planning <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0514-6" target="_blank" rel="noopener">ICADA guideline</a>',
                  plan: "Adjust meds before peak season; increase bathing, wipe-downs after outdoor exposure.",
                  rx: "Short antipruritic courses per plan; focal topical steroids; antipruritic wipes.",
                  red: "Failure of control or new lesion types → exam/cytology.",
                },
                {
                  case: 'Client training: bathing & topical application technique <a href="https://www.msdvetmanual.com/integumentary-system/integumentary-system-introduction/principles-of-topical-treatment-in-animals" target="_blank" rel="noopener">MSD (topical therapy)</a>',
                  plan: "Demonstrate lather/contact times, rinsing, drying; product rotation strategy.",
                  rx: "Shampoo/conditioner refills; measured dosing plans; follow-up photos.",
                  red: "Irritation/worsening after topical use → review ingredients & examine.",
                },
              ],
              note: "Allergy testing is not used to diagnose atopic dermatitis; it is performed after clinical diagnosis to select allergens for immunotherapy (ICADA consensus).",
            },
          ],
        },

        {
          id: "dermTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Telemedicine establishes history, triage, photos, and an initial plan; then partner clinics complete procedures/diagnostics. Results sync back to the tele-dermatologist and the client’s primary DVM.",
            },
            {
              type: "table",
              caption: "Start via telemedicine; complete at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (Derm DVM)" },
                { key: "clinic", title: "Clinic tasks & supervision" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'Otitis externa with discharge/pain (needs cytology) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2023-aaha-management-of-allergic-skin-diseases-in-dogs-and-cats-guidelines/resources/2023-aaha-management-of-allergic-skin-diseases-guidelines.pdf" target="_blank" rel="noopener">AAHA 2023</a>',
                  tele: "History, photo/video of pinna/ear canal, analgesia plan; schedule clinic cytology.",
                  clinic:
                    "Ear cytology + flush; RVT may perform tasks per supervising DVM; DVM finalizes Dx/Rx.",
                  notes:
                    "Targeted topical therapy after cytology; recheck by photo/video.",
                },
                {
                  case: 'Superficial pyoderma (suspicious recurrence) → confirm & culture as needed <a href="https://www.msdvetmanual.com/integumentary-system/pyoderma/pyoderma-in-dogs-and-cats" target="_blank" rel="noopener">MSD Vet Manual</a>',
                  tele: "Lesion history & photos; antimicrobial stewardship counseling; schedule cytology ± culture.",
                  clinic:
                    "Skin cytology (impression/tape); culture when indicated; DVM selects therapy.",
                  notes:
                    "Topical + targeted systemic therapy; follow-up by video/photo.",
                },
                {
                  case: 'Dermatophytosis suspected (ringworm) <a href="https://pubmed.ncbi.nlm.nih.gov/28494152/" target="_blank" rel="noopener">WAVD consensus</a>',
                  tele: "Screen housemates; discuss decontamination; order Wood’s lamp & culture/PCR.",
                  clinic:
                    "Wood’s lamp, sample collection for culture/PCR; DVM initiates therapy.",
                  notes:
                    "Topical + (cats: often) systemic therapy; environmental control; tele-rechecks.",
                },
                {
                  case: 'Demodicosis vs. sarcoptic mange (mite rule-out) <a href="https://www.msdvetmanual.com/integumentary-system/mange-and-mite-infestations/sarcoptic-mange-in-dogs" target="_blank" rel="noopener">MSD Vet Manual</a>',
                  tele: "History/photos, contagion counseling; order scrapings/trichograms.",
                  clinic:
                    "Deep/superficial skin scrapings, trichogram; DVM interprets & treats.",
                  notes:
                    "Targeted acaricidal therapy; tele-follow-up for skin recovery/secondary infection.",
                },
                {
                  case: 'Discussing allergy testing (for ASIT selection, not diagnosis) <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0515-5" target="_blank" rel="noopener">ICADA (ASIT)</a>',
                  tele: "Confirm clinical Dx of AD; set expectations; discuss intradermal vs serum testing for ASIT planning.",
                  clinic:
                    "Perform IDT or serum IgE; formulate immunotherapy prescription.",
                  notes:
                    "Proceed with ASIT where appropriate; tele-rechecks for flare control and adherence.",
                },
              ],
              note: "Example workflow: Monday video visit → Derm DVM orders ear cytology at Partner Clinic A. Clinic logs indirect supervision; RVT performs collection/flush. Results sync to the tele-Derm chart and the client’s primary DVM.",
            },
          ],
        },
      ],
    },

    oncologyTelemedicine: {
      mainTitle:
        "Telemedicine: Oncology — Clinical Considerations (DACVIM-Oncology)",
      mainDescription:
        "Tele-oncology excels at diagnosis reviews, treatment planning, toxicity monitoring, and hospice/QOL counseling. Procedures, chemotherapy infusions, imaging, and biopsies are performed in-clinic; telemedicine extends continuity of care and client education.",
      sections: [
        {
          id: "oncologyTelemedComplete",
          title: "Oncology: Consults Commonly Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These consults are routinely handled by a veterinary oncologist or oncology-focused GP over live audio-video with photo/PDF review, then e-prescribed to the client’s chosen pharmacy when appropriate.",
            },
            {
              type: "table",
              caption:
                "Oncology consults commonly completed via telemedicine (with e-pharmacy options for supportive care)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (Oncology DVM)" },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Confirmed multicentric lymphoma: staging & CHOP counseling <a href="https://www.merckvetmanual.com/circulatory-system/lymphoma-in-dogs/lymphoma-in-dogs" target="_blank" rel="noopener">ref</a> <a href="https://uwveterinarycare.wisc.edu/wp-content/uploads/2019/06/k9_chop.pdf" target="_blank" rel="noopener">protocol</a>',
                  plan: "Review histopath/cytology, outline staging (minimum database, thoracic imaging ± abdominal US), discuss CHOP vs palliative steroid; VCOG toxicity expectations and recheck cadence.",
                  rx: "Prednisone if palliative; antiemetics (maropitant/ondansetron), gastroprotectants if indicated.",
                  red: "Inappetence >24–48h, repeated vomiting/diarrhea, fever, dyspnea, rapidly enlarging nodes.",
                },
                {
                  case: 'Post-op mast cell tumor: margin/grade review & next steps <a href="https://pubmed.ncbi.nlm.nih.gov/22882486/" target="_blank" rel="noopener">ref</a> <a href="https://www.merckvetmanual.com/integumentary-system/tumors-of-the-skin-and-soft-tissues/lymphocytic-histiocytic-and-related-cutaneous-tumors-in-animals" target="_blank" rel="noopener">overview</a>',
                  plan: "Explain grade/mitotic index/Ki-67 if reported; discuss re-excision vs radiation vs medical therapy; taper plan for pre-op steroids if used.",
                  rx: "H1/H2 blockers (diphenhydramine, famotidine); short pred course if indicated; topical care guidance.",
                  red: "Dehiscence, progressive swelling, signs of GI ulceration, new masses, systemic illness.",
                },
                {
                  case: 'Urothelial (transitional cell) carcinoma: medical management counseling <a href="https://www.merckvetmanual.com/pharmacology/inflammation/nonsteroidal-anti-inflammatory-drugs-in-animals" target="_blank" rel="noopener">NSAIDs</a> <a href="https://pubmed.ncbi.nlm.nih.gov/7983623/" target="_blank" rel="noopener">piroxicam study</a> <a href="https://www.merckvetmanual.com/urinary-system/noninfectious-diseases-of-the-urinary-system-in-small-animals/neoplasia-of-the-urinary-system-in-dogs-and-cats" target="_blank" rel="noopener">overview</a>',
                  plan: "Discuss role of COX-inhibiting NSAIDs ± chemo; home signs to monitor; schedule UA/urine culture & imaging locally; catheterization/obstruction risks explained.",
                  rx: "Piroxicam or COX-2–selective NSAID when appropriate; antiemetics; urinary comfort measures.",
                  red: "Straining without urine, gross hematuria with clots, obstruction signs, crashing patient.",
                },
                {
                  case: 'Osteosarcoma: options review (amputation vs limb-sparing vs palliation) <a href="https://www.merckvetmanual.com/musculoskeletal-system/osteopathies-in-small-animals/bone-tumors-in-dogs-and-cats" target="_blank" rel="noopener">overview</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4330401/" target="_blank" rel="noopener">review</a>',
                  plan: "Explain goals, expected survival with surgery±chemo, palliative radiation; home safety and fracture risk; analgesic ladder without controlleds via telehealth.",
                  rx: "NSAID; adjuncts such as gabapentin; antiemetics PRN during therapy; GI protectants if indicated.",
                  red: "Pathologic fracture, severe uncontrolled pain, respiratory distress, acute decline.",
                },
                {
                  case: 'Soft-tissue sarcoma: post-op histopath margin consult ± radiation referral <a href="https://www.merckvetmanual.com/integumentary-system/tumors-of-the-skin-and-soft-tissues/connective-tissue-tumors-in-animals" target="_blank" rel="noopener">ref</a>',
                  plan: "Clarify margins/grade; counsel on re-excision vs adjuvant radiation; wound/photo checks; schedule surveillance imaging plan.",
                  rx: "NSAID for discomfort if appropriate; topical wound care supplies; activity modification guidance.",
                  red: "Rapid local regrowth, wound failure/infection, limb dysfunction or neuro deficits.",
                },
                {
                  case: 'Oral melanoma: pathology & local-control/adjuvant plan <a href="https://www.merckvetmanual.com/integumentary-system/tumors-of-the-skin-and-soft-tissues/tumors-of-melanocytic-origin-in-animals" target="_blank" rel="noopener">overview</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11026649/" target="_blank" rel="noopener">consensus</a>',
                  plan: "Discuss surgery margins, role of radiation when incomplete, and immunotherapy options; outline staging and recheck cadence.",
                  rx: "Analgesic adjuncts (non-controlled), antiseptic oral rinses, antiemetics if needed during therapy.",
                  red: "Oral bleeding, dysphagia, airway compromise, rapidly enlarging mass, weight loss.",
                },
                {
                  case: 'Hemangiosarcoma: prognosis setting & palliative/supportive roadmap <a href="https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-information/hemangiosarcoma-dogs" target="_blank" rel="noopener">ref</a> <a href="https://www.merckvetmanual.com/special-pet-topics/cancer-and-tumors/caring-for-a-pet-with-cancer" target="_blank" rel="noopener">supportive care</a>',
                  plan: "Explain typical course and staging; discuss doxorubicin-based plans to be performed in-clinic; set QOL monitoring and emergency signs.",
                  rx: "Antiemetics, gastroprotectants, omega-3s; non-controlled analgesic adjuncts; iron support only if indicated.",
                  red: "Collapse/weakness, abdominal distension, pale gums, respiratory distress → emergency care.",
                },
                {
                  case: 'Chemotherapy toxicity check-in: AE grading & rescue meds <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8248125/" target="_blank" rel="noopener">VCOG-CTCAE v2</a>',
                  plan: "Tele-review of appetite, GI signs, mucositis, lethargy; grade AEs using VCOG-CTCAE; adjust next-cycle plan with local CBCs.",
                  rx: "Maropitant/ondansetron; metronidazole only if indicated and within stewardship rules; bland-diet plan; topical care for mild dermatitis.",
                  red: "Profuse vomiting/diarrhea, hemorrhage, febrile neutropenia signs, inability to keep meds/fluids down.",
                },
                {
                  case: 'Response assessment review (RECIST measurements) <a href="https://www.semanticscholar.org/paper/Response-evaluation-criteria-for-solid-tumours-in-a-Nguyen-Thamm/96f3ca171e7e9ac931e6321d5fac79565151e042" target="_blank" rel="noopener">VCOG-RECIST</a>',
                  plan: "Compare serial imaging reports from partner clinic using v1.0 RECIST rules; document PR/SD/PD and adjust plan.",
                  rx: "Supportive meds per case; schedule next imaging or switch therapy discussion.",
                  red: "Rapid clinical decline, new painful lesions, suspected metastasis with clinical impact.",
                },
                {
                  case: 'Hospice & quality-of-life planning (HHHHHMM scale) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/end-of-life-care/2016_aaha_iaahpc_eolc_guidelines.pdf" target="_blank" rel="noopener">AAHA/IAAHPC</a> <a href="https://caringpathways.com/wp-content/uploads/2018/02/QualityofLifeScale.pdf" target="_blank" rel="noopener">HHHHHMM</a>',
                  plan: "Teach QOL scoring, comfort-first goals, anticipatory guidance; discuss home safety, nutrition, hydration, and caregiver support.",
                  rx: "Mirtazapine/mirataz, maropitant/ondansetron, GI protectants, stool softeners; non-controlled analgesic adjuncts.",
                  red: "Uncontrolled pain/dyspnea, refractory nausea, persistent anorexia/dehydration, more bad days than good.",
                },
              ],
              note: "AB 1399 permits establishing VCPR by live audio-video. California prohibits prescribing controlled substances via telehealth without an in-person exam; arrange in-clinic care as needed. Use VCOG-CTCAE for AE grading, and RECIST conventions for response documentation when reviewing partner-clinic imaging.",
            },
          ],
        },
      ],
    },
    behaviorTelemedicine: {
      mainTitle: "Telemedicine: Behavior — Clinical Considerations (DACVB)",
      mainDescription:
        "Board-certified behaviorists (DACVB) use video + owner-supplied footage and structured histories to diagnose and treat many behavior disorders remotely. Telemedicine excels at assessment, coaching, and pharmacologic plans with close follow-ups; in-person care is reserved for safety issues and medical rule-outs.",
      sections: [
        {
          id: "behaviorTelemedComplete",
          title: "Behavior: Consults Commonly Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "Live video + home videos often yield superior context for behavior cases versus clinic visits. Below are common tele-behavior cases with example plans, typical non-controlled eRx options, and red flags requiring in-person evaluation.",
            },
            {
              type: "table",
              caption:
                "Behavior consults commonly completed via telemedicine (with e-pharmacy options for non-controlled meds)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                {
                  key: "plan",
                  title: "Telemedicine plan (DACVB/behavior DVM)",
                },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Canine separation-related disorder (SRD) — confirm with home alone video <a href="https://avsab.org/separation-anxiety-the-great-imitator-part-1-2/" target="_blank" rel="noopener">AVSAB</a> <a href="https://www.merckvetmanual.com/behavior/behavior-of-dogs/behavior-problems-of-dogs" target="_blank" rel="noopener">Merck</a>',
                  plan: "Structured history; obtain brief home-alone video; build DS/CC plan; environmental management; staged absences; caregiver coaching; recheck cadence.",
                  rx: "Fluoxetine or clomipramine; trazodone/gabapentin PRN for practice sessions; enrichment plan.",
                  red: "Self-injury, destructive escape that risks injury, severe anorexia/vomiting from distress, comorbid medical signs.",
                },
                {
                  case: 'Noise aversion (storm/fireworks) <a href="https://www.msdvetmanual.com/pharmacology/systemic-pharmacotherapeutics-of-the-nervous-system/psychotropic-agents-for-treatment-of-animals" target="_blank" rel="noopener">Merck–imepitoin/Sileo</a> <a href="https://todaysveterinarypractice.com/behavior/noise-storm-phobias-anxiety-in-dogs/" target="_blank" rel="noopener">TVP review</a>',
                  plan: "Trigger audit; safe-space setup; DS/CC with sound files; predict-and-prevent strategy; practice days before events.",
                  rx: "Dexmedetomidine oromucosal gel (Sileo®); imepitoin (where labeled); SSRI/TCA maintenance when indicated; short-acting adjuncts PRN (non-controlled).",
                  red: "Panic causing flight/escape risk, destructive chewing/eating foreign bodies, syncope-like episodes.",
                },
                {
                  case: 'Puppy prevention & socialization plan (7–16 wks) <a href="https://avsab.org/wp-content/uploads/2018/03/Puppy_Socialization_Position_Statement_Download_-_10-3-14.pdf" target="_blank" rel="noopener">AVSAB</a>',
                  plan: "Vaccination-aware socialization calendar; normalized handling; noise/husbandry plan; early problem prevention; owner training on reward-based methods.",
                  rx: "Pheromone diffuser (DAP); treat-based training kit; printed/socialization checklists; follow-up coaching.",
                  red: "Extreme fear or shutdown responses; puppy injuring others; medical concerns interfering with socialization.",
                },
                {
                  case: 'Generalized fear/anxiety & reactivity (foundation plan) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/behavior-management/2015_aaha_canine_and_feline_behavior_management_guidelines_final.pdf" target="_blank" rel="noopener">AAHA</a> <a href="https://avsab.org/wp-content/uploads/2021/08/AVSAB-Humane-Dog-Training-Position-Statement-2021.pdf" target="_blank" rel="noopener">AVSAB</a>',
                  plan: "Dx clarification; trigger hierarchy; DS/CC plan; relaxation protocol; trainer referral standards; safety/muzzle conditioning if needed.",
                  rx: "Fluoxetine/sertraline or clomipramine; trazodone/gabapentin PRN for setups; nutraceuticals as adjuncts.",
                  red: "Escalating bite history, unpredictable aggression, suspected pain/neurologic signs → physical exam, lab work, imaging as indicated.",
                },
                {
                  case: 'Leash reactivity / stranger-directed fear (canine) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/behavior-management/2015_aaha_canine_and_feline_behavior_management_guidelines_final.pdf" target="_blank" rel="noopener">AAHA</a>',
                  plan: "Event analysis; threshold management; parallel walks; DS/CC with controlled exposures; equipment fit; trainer collaboration.",
                  rx: "SSRI/TCA baseline when generalized; trazodone or gabapentin PRN for training sessions.",
                  red: "Bites or near-bites to people/dogs, handler not able to safely conduct setups → in-person team support.",
                },
                {
                  case: 'Resource guarding / possessive aggression plan <a href="https://avsab.org/wp-content/uploads/2018/03/Dominance_Position_Statement_download-10-3-14.pdf" target="_blank" rel="noopener">AVSAB (Dominance)</a> <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/behavior-management/2015_aaha_canine_and_feline_behavior_management_guidelines_final.pdf" target="_blank" rel="noopener">AAHA</a>',
                  plan: "Risk assessment; trade-up and conditioning protocols; management to prevent rehearsals; structured handling rules.",
                  rx: "As indicated for fear/anxiety (SSRI/TCA); short-acting adjuncts for practice sessions.",
                  red: "History of puncture/laceration, guarding of people/doorways, escalating threats → in-person behaviorist + safety gear fitting.",
                },
                {
                  case: 'Feline house-soiling (toileting) — litter box optimization <a href="https://catvets.com/wp-content/uploads/2024/08/house-soiling-guidelines.pdf" target="_blank" rel="noopener">AAFP/ISFM</a>',
                  plan: "History & mapping; box number/size/substrate/location; cleaning frequency; stress reduction (5 pillars).",
                  rx: "Pheromones (F3), stool softeners if indicated, diet/fluids as appropriate; owner handouts.",
                  red: "Stranguria/hematuria, obstruction risk (male cats), weight loss, systemic signs → same-day in-person care.",
                },
                {
                  case: 'Feline urine marking vs toileting — differentiate first <a href="https://www.merckvetmanual.com/multimedia/table/distinguishing-urine-marking-from-undesirable-toileting-in-cats" target="_blank" rel="noopener">Merck table</a>',
                  plan: "History + photo mapping; vertical vs horizontal, volume/posture; social stressors; environmental modifications.",
                  rx: "Pheromones; SSRI/TCA when indicated; neutering if intact; multi-cat resource distribution.",
                  red: "Pain on urination, obstruction signs, new aggression causing injury → in-person exam and labs.",
                },
                {
                  case: 'Canine cognitive dysfunction (CDS) — senior care plan <a href="https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/cognitive-dysfunction-syndrome" target="_blank" rel="noopener">Cornell</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6582309/" target="_blank" rel="noopener">Review</a>',
                  plan: "DISHA-A history; sleep-wake and enrichment plan; caregiver support; fall-risk/sundowning strategies; periodic labs via PCP.",
                  rx: "Selegiline; omega-3s/MCT diets; melatonin PRN; anxiolytic adjuncts when appropriate.",
                  red: "Acute neuro changes, severe disorientation/wandering risk, rapid weight loss → in-person workup.",
                },
                {
                  case: 'Compulsive/ritualistic behaviors (rule-out pain/derm first) <a href="https://www.msdvetmanual.com/behavior/behavior-of-dogs/behavior-problems-of-dogs" target="_blank" rel="noopener">Merck</a>',
                  plan: "Differentials (derm, neuropathic pain, GI); enrich/interrupt routines; DS/CC; trainer selection; video tracking.",
                  rx: "SSRI/TCA baseline; adjuncts for arousal control; treat medical comorbidities first.",
                  red: "Self-mutilation, suspected neuropathy/orthopedic pain, failure of environmental control → in-person diagnostics.",
                },
              ],
              note: "Compliance notes (CA AB 1399): VCPR can be established via synchronous audio-video; you must know local emergency resources and document standard-of-care decision-making. **Controlled substances cannot be prescribed via telehealth without an in-person exam**—prefer non-controlled options and coordinate labs/physicals with a partner clinic when needed. (See CA VMB FAQs & AAHA/AVMA Telehealth Guidelines.)",
            },
          ],
        },
      ],
    },
    nutritionTelemedicine: {
      mainTitle: "Telemedicine: Nutrition — Clinical Considerations (DACVN)",
      mainDescription:
        "Tele-nutrition excels for stable patients, longitudinal coaching, and individualized diet formulation. Labs, imaging, and procedures are routed to partner clinics as needed; results sync back to keep the primary DVM in the loop.",
      sections: [
        {
          id: "nutritionTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These cases are typically managed via live video by a board-certified veterinary nutritionist (or nutrition-focused DVM). Plans emphasize evidence-based diets, measured feeding, and monitoring. When diagnostics or hands-on care are needed, orders go to a partner clinic; follow-ups return to tele-nutrition.",
            },
            {
              type: "table",
              caption:
                "Nutrition cases commonly completed via telemedicine (with e-pharmacy / therapeutic diet options)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (DACVN/DVM)" },
                { key: "rx", title: "Example eRx / diet" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Obesity / weight-management program <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2021-nutrition-and-weight-management/resourcepdfs/new-2021-aaha-nutrition-and-weight-management-guidelines-with-ref.pdf" target="_blank" rel="noopener">guideline</a>',
                  plan: "Diet history, BCS/MCS scoring, target-weight math, kcal/day, meal plan, exercise plan, recheck cadence; owner coaching and barriers troubleshooting.",
                  rx: "Therapeutic weight-management diet; measuring tools; omega-3 as indicated; goal: 0.5–2% BW loss/week.",
                  red: "Rapid unintended weight loss, polyuria/polydipsia, weakness, suspected endocrine disease → labs and in-clinic exam.",
                },
                {
                  case: 'Chronic kidney disease (stable) diet therapy <a href="https://www.idexx.com/files/iris-pocket-guide-2.pdf" target="_blank" rel="noopener">IRIS</a>',
                  plan: "Stage-based nutrition (phosphorus restriction, appropriate protein), hydration strategies, appetite support, monitor weight/BCS/MCS; coordinate labs with partner clinic.",
                  rx: "Renal therapeutic diet; omega-3 where appropriate; phosphate binders per labs; anti-nausea if indicated.",
                  red: "Uremic signs, dehydration, inappetence >24–48h, progressive azotemia → in-clinic assessment; consider fluids/feeding tube.",
                },
                {
                  case: 'Diabetes mellitus nutrition (dogs & cats) <a href="https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA</a>',
                  plan: "Carb/fiber strategy (species-specific), timed meals with insulin plan (co-managed with GP/IM), weight goals, home logs.",
                  rx: "Therapeutic diabetic diet; low-carb high-protein for most cats; high-fiber options for many dogs; appetite support if needed.",
                  red: "Ketoacidosis signs, inappetence, vomiting, lethargy, hypoglycemia → urgent in-person care.",
                },
                {
                  case: 'Food allergy / adverse food reaction: elimination diet trial <a href="https://www.merckvetmanual.com/integumentary-system/food-allergy/cutaneous-food-allergy-in-animals" target="_blank" rel="noopener">reference</a>',
                  plan: "Strict 8–12-week elimination diet (hydrolyzed or truly novel), challenge/re-challenge plan, compliance coaching, treat/substance avoidance list.",
                  rx: "Veterinary hydrolyzed or novel-protein diet; limited treats matching the trial; written rules for meds/flavored products.",
                  red: "Secondary infection, otitis with discharge, weight loss, GI bleeding, non-response → in-clinic cytology/workup.",
                },
                {
                  case: 'Chronic enteropathy: diet-responsive protocols <a href="https://todaysveterinarypractice.com/nutrition/diet-trials-for-chronic-enteropathy/" target="_blank" rel="noopener">overview</a>',
                  plan: "Structured step-up diet trials (highly digestible → hydrolyzed/novel protein), fiber strategy, recheck timelines; coordinate fecal/labs with clinic.",
                  rx: "Therapeutic GI diet; hydrolyzed/novel protein diet; adjunct probiotics where indicated; cobalamin if deficient.",
                  red: "Hypoproteinemia, hematochezia/melena, dehydration, weight loss, abdominal pain → in-person diagnostics.",
                },
                {
                  case: 'Pancreatitis (post-acute nutrition & relapse prevention) <a href="https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/pancreatitis-in-dogs-and-cats" target="_blank" rel="noopener">Merck Vet Manual</a>',
                  plan: "After stabilization, transition to appropriate diet and meal pattern; fat restriction for dogs when indicated; anti-nausea/pain plan with GP; relapse triggers review.",
                  rx: "Low-fat canine GI diet when appropriate; highly digestible feline diet; antiemetics as GP prescribes; appetite support plan.",
                  red: "Acute abdominal pain, persistent vomiting, anorexia, lethargy/dehydration → immediate in-clinic care.",
                },
                {
                  case: 'Exocrine pancreatic insufficiency (EPI): diet & cobalamin plan <a href="https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/exocrine-pancreatic-insufficiency-in-dogs-and-cats" target="_blank" rel="noopener">Merck Vet Manual</a>',
                  plan: "Confirm dx via GP; design enzyme-with-meals protocol, diet selection, feeding schedule; monitor weight and stool quality; cobalamin strategy.",
                  rx: "Pancreatic enzyme powder with every meal; highly digestible diet; cobalamin supplementation if deficient.",
                  red: "Failure to gain weight despite therapy, persistent diarrhea, suspected comorbidities → in-clinic reassessment.",
                },
                {
                  case: 'Urolithiasis nutrition: struvite dissolution & prevention <a href="https://urolithcenter.org/recommendations/34?locale=en" target="_blank" rel="noopener">Minnesota Urolith Center</a>',
                  plan: "Diet selection and monitoring schedule; partner clinic imaging/urinalysis cadence; culture-guided antibiotic use for infection-induced struvite.",
                  rx: "Therapeutic dissolution diet for struvite; increased water intake; prevention diet thereafter per stone type.",
                  red: "Obstruction signs, dysuria/stranguria with distress, recurrent infections → urgent in-person evaluation.",
                },
                {
                  case: 'Growth nutrition (esp. large-breed puppies) <a href="https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/home/" target="_blank" rel="noopener">AAHA</a>',
                  plan: "Life-stage diet selection, calcium/phosphorus appropriateness for large breeds, measured feeding for steady growth, BCS tracking, transition timing.",
                  rx: "Complete & balanced growth diet appropriate for large breeds; feeding plan with measured meals; owner education.",
                  red: "Lameness, orthopedic pain, stunted or excessive growth, persistent GI issues → in-person exam and radiographs as indicated.",
                },
                {
                  case: 'Home-prepared diet formulation (owner preference or multi-morbid cases) <a href="https://www.aaha.org/resources/2021-aaha-nutrition-and-weight-management-guidelines/home-prepared-diets/" target="_blank" rel="noopener">AAHA/ACVN</a>',
                  plan: "Full medical and diet history, goals, recipe design or evaluation by a board-certified veterinary nutritionist, periodic re-checks and recipe updates.",
                  rx: "Custom complete-and-balanced recipe; supplement plan; written prep instructions; follow-up schedule.",
                  red: "Growing puppies/kittens without expert-formulated recipe, weight loss, nutrient deficiency signs → in-person workup and recipe revision.",
                },
              ],
              note: "Tele-nutrition consults are ideal for stable patients. Diagnostics (labs, UA, imaging) and any procedures occur at partner clinics; results sync back. Always align diet choices with the pet’s diagnoses, meds, and life stage; use BCS/MCS and objective weight trends at each recheck.",
            },
          ],
        },
      ],
    },
    endocrinologyTelemedicine: {
      mainTitle:
        "Telemedicine: Endocrinology — Clinical Considerations(SAIM/DACVIM Perspective)",
      mainDescription:
        "Tele-endocrinology is ideal for longitudinal management, dose titration, client coaching, and shared decision-making. Diagnostics (CBC/chem/UA, thyroid panels, ACTH stimulation, LDDST, fructosamine, blood pressure) are routed to partner clinics as needed; results sync back so the primary DVM stays in the loop.",
      sections: [
        {
          id: "endoTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These conditions are typically managed by live video once diagnosis and essential baselines are established. Plans emphasize guideline-based monitoring with pharmacy or therapeutic-diet coordination and clear return precautions.",
            },
            {
              type: "table",
              caption:
                "Endocrine cases commonly completed via telemedicine (with e-pharmacy / shared monitoring)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (SAIM/DACVIM)" },
                { key: "rx", title: "Example eRx / monitoring" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Canine diabetes mellitus: dose titration & home monitoring <a href="https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA Diabetes</a>',
                  plan: "Review logs (app/glucose curves), adjust insulin per signs & curves; reinforce feeding/timing; set recheck cadence and fructosamine schedule.",
                  rx: "Insulin & supplies; antiemetic PRN; written hypoglycemia plan; consider CGM/home curves per owner capability.",
                  red: "Inappetence, vomiting, weakness, suspected DKA/HHS → urgent in-person care.",
                },
                {
                  case: 'Feline diabetes: remission-oriented management <a href="https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA Diabetes</a>',
                  plan: "Low-carb diet coaching, tight clinical monitoring, stepwise insulin adjustments, remission watch; owner video/photos of behavior and appetite.",
                  rx: "Insulin & syringes/pen; diet plan; fructosamine at clinic per schedule.",
                  red: "Anorexia, recurrent hypoglycemia, ketonuria/ketosis → in-person.",
                },
                {
                  case: 'Feline hyperthyroidism under medical management (methimazole) <a href="https://catvets.com/resource/management-of-feline-hyperthyroidism-guidelines/" target="_blank" rel="noopener">AAFP 2016</a> <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/feline-hyperthyroidism/" target="_blank" rel="noopener">AAHA 2023</a>',
                  plan: "Dose adjustment counseling, adverse-effect screening, diet/iodine discussion, BP/renal monitoring schedule coordinated with clinic.",
                  rx: "Methimazole (oral/transdermal); monitor T4, CBC/chem, BP at set intervals.",
                  red: "Lethargy, GI upset not resolving, azotemia progression, uncontrolled tachycardia/HTN → clinic diagnostics.",
                },
                {
                  case: 'Canine hypothyroidism on L-T4: routine monitoring <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/canine-hypothyroidism/" target="_blank" rel="noopener">AAHA 2023</a> <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/therapy/" target="_blank" rel="noopener">AAHA Therapy</a>',
                  plan: "Check clinical response; set post-pill TT4 timing; adjust dose per signs and labs; address adherence and drug interactions.",
                  rx: "Levothyroxine; lab rechecks via partner clinic (post-pill TT4 4–6h).",
                  red: "Signs of iatrogenic hyperthyroidism (PU/PD, panting, weight loss, restlessness) → exam and labs.",
                },
                {
                  case: 'Canine hypoadrenocorticism (Addison’s): maintenance check-ins <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/canine-hypoadrenocorticism-addisons-disease/" target="_blank" rel="noopener">AAHA 2023</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6055912/" target="_blank" rel="noopener">Review</a>',
                  plan: "Assess clinical control, stress-dose plan, interval electrolytes via clinic; reinforce owner crisis plan.",
                  rx: "DOCP or fludrocortisone; low-dose prednisone; scheduled Na/K checks.",
                  red: "Vomiting/diarrhea, collapse, weakness, hyperkalemic signs → emergency.",
                },
                {
                  case: 'Canine hyperadrenocorticism (Cushing’s): between-test clinical monitoring <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/" target="_blank" rel="noopener">AAHA 2023</a> <a href="https://www.aaha.org/newstat/publications/monitoring-strategies-for-trilostane-therapy-in-dogs-with-cushings-syndrome/" target="_blank" rel="noopener">Monitoring</a>',
                  plan: "Owner-reported signs/QOL, med timing, adverse-effect screen; coordinate ACTH stim rechecks with clinic.",
                  rx: "Trilostane; targeted labs per protocol; adjust dose after clinic testing.",
                  red: "Anorexia, vomiting, lethargy, suspected adrenal oversuppression → in-person.",
                },
                {
                  case: 'Hypertension counseling in endocrine patients (esp. hyperthyroid cats) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6271319/" target="_blank" rel="noopener">ACVIM HTN 2018</a>',
                  plan: "Explain risk, home monitoring feasibility, target ranges; schedule clinic BP and fundic exam cadence; adjust plan with DVM.",
                  rx: "Antihypertensives per DVM where indicated; coordinate BP checks.",
                  red: "Ocular/neuro signs, refractory BP elevation → immediate clinic care.",
                },
                {
                  case: 'Owner training: home glucose curves / data capture <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/diabetes/2018-aaha-diabetes-management-guidelines-2022-update.pdf" target="_blank" rel="noopener">AAHA Diabetes PDF</a>',
                  plan: "Coach technique, frequency, and data interpretation; build feedback loop; set triggers for contacting clinic.",
                  rx: "Meters/CGM where appropriate; fructosamine via clinic at intervals.",
                  red: "Symptomatic hypo/hyperglycemia, persistent vomiting, anorexia → clinic.",
                },
                {
                  case: 'Post-I-131 discharge counseling & nutrition (cats) <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/feline-hyperthyroidism/" target="_blank" rel="noopener">AAHA 2023</a>',
                  plan: "Discuss expected timeline, monitoring labs, renal watch, diet; set recheck plan with clinic.",
                  rx: "No anti-thyroid meds if cured; anti-hypertensives PRN; renal diet if needed per labs.",
                  red: "Progressive azotemia, uncontrolled hypertension, weight loss → clinic.",
                },
                {
                  case: 'Client education for endocrine comorbidity (weight, diet, meds timing) <a href="https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA Diabetes</a>',
                  plan: "Reinforce dosing windows, meal pairing, travel/boarding plans; document shared plan and return precautions.",
                  rx: "Refills and supplies; written sick-day and dose-adjustment rules.",
                  red: "Any acute decompensation or new systemic signs → in-person.",
                },
              ],
              note: "Tele-endocrinology focuses on signs-based adjustments, owner training, and shared monitoring. Most dose changes are confirmed against scheduled clinic labs (fructosamine, TT4, electrolytes, ACTH stim, LDDST, blood pressure).",
            },
          ],
        },
        {
          id: "endoTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Typical pathways where a video consult initiates workup and plan, then a partner clinic performs tests/procedures; results flow back for tele follow-up.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (SAIM/DACVIM)" },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'New diabetes workup & initiation <a href="https://www.aaha.org/resources/2018-aaha-diabetes-management-guideline-for-dogs-and-cats/" target="_blank" rel="noopener">AAHA Diabetes</a>',
                  tele: "History, differentials, owner training overview, initial diet/insulin counseling, order baseline labs.",
                  clinic:
                    "CBC/chem/UA ± urine culture; fructosamine; nurse/RVT insulin demo; first recheck scheduling.",
                  notes:
                    "Tele follow-up for dose titration using curves; periodic clinic labs.",
                },
                {
                  case: 'Suspected hyperadrenocorticism (Cushing’s) <a href="https://pubmed.ncbi.nlm.nih.gov/24112317/" target="_blank" rel="noopener">ACVIM HAC 2012</a>',
                  tele: "Screen for compatible signs; discuss testing algorithms; place orders.",
                  clinic:
                    "LDDST or ACTH stimulation ± imaging; baseline electrolytes/chemistry.",
                  notes:
                    "If confirmed, start trilostane; clinical monitoring by tele + scheduled ACTH stim at clinic.",
                },
                {
                  case: 'Suspected hypoadrenocorticism (Addison’s) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6055912/" target="_blank" rel="noopener">Review</a> <a href="https://www.aaha.org/resources/2023-aaha-selected-endocrinopathies-of-dogs-and-cats-guidelines/canine-hypoadrenocorticism-addisons-disease/" target="_blank" rel="noopener">AAHA 2023</a>',
                  tele: "Triage, crisis plan, order screening labs; educate on emergency signs.",
                  clinic:
                    "Baseline cortisol ± ACTH stimulation; electrolytes; stabilization if needed.",
                  notes:
                    "Begin DOCP/fludrocortisone + prednisone; tele follow-ups; electrolytes at clinic per schedule.",
                },
                {
                  case: 'Suspected feline hyperthyroidism (new) <a href="https://catvets.com/resource/management-of-feline-hyperthyroidism-guidelines/" target="_blank" rel="noopener">AAFP 2016</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6271319/" target="_blank" rel="noopener">ACVIM HTN 2018</a>',
                  tele: "History, signs, therapy options (I-131, methimazole, diet); place lab/BP orders.",
                  clinic:
                    "Total T4 ± free T4, CBC/chem/UA; blood pressure & fundic exam; renal staging.",
                  notes:
                    "Choose therapy; subsequent dose adjustments & owner coaching via tele.",
                },
                {
                  case: 'Refractory diabetic cat: rule-out acromegaly <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0127794" target="_blank" rel="noopener">Niessen 2015</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7995378/" target="_blank" rel="noopener">Fenn 2021</a>',
                  tele: "Identify insulin resistance pattern; discuss advanced testing and options; refer if needed.",
                  clinic:
                    "Serum IGF-1; advanced imaging/referral (CT/MRI) for pituitary disease; consider radiation/surgery centers.",
                  notes:
                    "If HST confirmed, discuss definitive vs medical options; tele follow-ups coordinate with specialty center.",
                },
              ],
              note: "Example workflow: video consult → place LDDST/ACTH stim orders → clinic completes testing → results sync back → tele follow-up to set dose/monitoring cadence.",
            },
          ],
        },
      ],
    },
    nephrologyUrologyTelemedicine: {
      mainTitle:
        "Telemedicine: Nephrology & Urology — Clinical Considerations (DACVIM-SAIM perspective)",
      mainDescription:
        "Stable medical management and owner coaching are highly telemedicine-friendly in nephrology/urology. Diagnostics requiring samples or imaging happen in-clinic, with follow-ups and care plans completed by video.",
      sections: [
        {
          id: "nephroUroTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These are kidney/urinary problems that a board-certified internist (or GP with internal-medicine interest) can usually manage by live video, then e-prescribe to the client’s chosen pharmacy when appropriate. In-person care is needed if red-flags appear.",
            },
            {
              type: "table",
              caption:
                "Nephrology/Urology cases commonly completed via telemedicine (with e-pharmacy options)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (Nephro/Uro)" },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: `Chronic kidney disease (CKD) — staged maintenance <a href="https://www.idexx.com/files/iris-pocket-guide-2.pdf" target="_blank" rel="noopener">IRIS CKD guide</a>`,
                  plan: "Review recent labs/UA/BP, confirm IRIS stage, adjust diet/hydration plan, phosphate control, nausea/appetite support, recheck cadence.",
                  rx: "Therapeutic renal diet; phosphate binders when indicated; anti-nausea; gastric protectants; omega-3; SQ fluids if already taught.",
                  red: "Anorexia >24–48h, vomiting, dehydration, melena/hematemesis, rapid weight loss, severe lethargy.",
                },
                {
                  case: `Proteinuria / PLN on maintenance therapy <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.12230" target="_blank" rel="noopener">ACVIM proteinuria</a> &nbsp;|&nbsp; <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4895689/" target="_blank" rel="noopener">Telmisartan (cats)</a>`,
                  plan: "Confirm recent UPC & BP trends, optimize RAAS blockade, diet sodium review, plan monitoring (UPC/BP/chemistry).",
                  rx: "ACE-i or ARB per species/response; renal diet; omega-3; consider dual therapy if guideline-supported and monitored.",
                  red: "UPC rising, hypertension uncontrolled, hypoalbuminemia/edema, azotemia worsening, suspected UTI.",
                },
                {
                  case: `Systemic hypertension in CKD cats/dogs (maintenance) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6271319/" target="_blank" rel="noopener">ACVIM HTN 2018</a>`,
                  plan: "Home BP log if available, review target-organ signs, titrate anti-hypertensives, schedule periodic in-clinic BP/fundic checks.",
                  rx: "Cats: amlodipine ± RAAS inhibitor; Dogs: RAAS inhibitor ± CCB per response; low-sodium diet guidance.",
                  red: "SBP likely ≥180 or TOD signs (retinal changes, neuro events), collapse, acute vision loss.",
                },
                {
                  case: `Feline idiopathic cystitis (FIC) — relapse prevention (MEMO) <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/feline-life-stage-2021/2021-aaha-aafp-feline-life-stage-guidelines.pdf" target="_blank" rel="noopener">AAHA/AAFP 2021</a>`,
                  plan: "Detailed history, stress mapping, litter/environment optimization, water-intake plan, flare protocol, follow-up photos.",
                  rx: "Diet/water strategies (fountains, wet food), pheromones, environmental enrichment; analgesia plans for flares as appropriate.",
                  red: "Stranguria/anuria, severe hematuria with obstruction risk, marked pain → emergency exam.",
                },
                {
                  case: `Urolithiasis recurrence prevention (CaOx history) <a href="https://urolithcenter.org/recommendations/16?locale=en" target="_blank" rel="noopener">MUC CaOx (feline)</a>`,
                  plan: "Review prior analysis, set urine SG/pH targets, diet selection, citrate considerations, re-image cadence (scheduled at clinic).",
                  rx: "Therapeutic urinary diet; water-intake optimization; potassium citrate when indicated.",
                  red: "Pollakiuria/dysuria, pain, suspected obstruction, recurrent hematuria despite plan.",
                },
                {
                  case: `Asymptomatic bacteriuria counseling (no antibiotics) <a href="https://www.vdl.ndsu.edu/wp-content/uploads/2022/02/ISCAID-Urinary-Guidelines-2019.pdf" target="_blank" rel="noopener">ISCAID 2019</a>`,
                  plan: "Explain distinction from UTI, avoid unnecessary antimicrobials, plan surveillance and triggers for culture if signs develop.",
                  rx: "None; address predisposing factors (urine dilution, hygiene, comorbidities) and monitoring.",
                  red: "Onset of clinical signs (dysuria, pollakiuria, hematuria), pyrexia, systemic illness.",
                },
                {
                  case: `CKD nutrition & phosphorus control coaching <a href="https://todaysveterinarypractice.com/urology-renal-medicine/treatment-chronic-kidney-disease-dogs-cats/" target="_blank" rel="noopener">CKD Tx overview</a>`,
                  plan: "Refine diet acceptance, treat nausea, stool/constipation plan, set follow-up intervals for labs and BP.",
                  rx: "Therapeutic renal diets; phosphate binders when indicated; anti-nausea ± appetite support per primary DVM.",
                  red: "Refusal to eat, weight loss, suspected GI bleeding, progressive azotemia symptoms.",
                },
                {
                  case: `Owner training & home hydration strategies <a href="https://www.iris-kidney.com/iris-guidelines-1" target="_blank" rel="noopener">IRIS resources</a>`,
                  plan: "Water-intake optimization, SQ fluid technique review if already prescribed, environmental changes to support kidney health.",
                  rx: "SQ fluid supplies when already part of care plan; water fountains, wet food transition.",
                  red: "Owner unable to administer fluids safely, signs of fluid overload, weakness/syncope.",
                },
              ],
              note: "Targets and thresholds follow IRIS/ACVIM consensus (e.g., CKD staging, proteinuria thresholds, and BP categories). Controlled substances generally require in-person exam per law.",
            },
          ],
        },
        {
          id: "nephroUroTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "These start with a video consult (history, differentials, initial plan), then a partner clinic completes diagnostics/procedures. Results and administration records sync back to the tele-internist and the client’s primary DVM.",
            },
            {
              type: "table",
              caption: "Start via telemedicine; complete at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (Nephro/Uro)" },
                { key: "clinic", title: "Clinic tasks & supervision" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: `Suspected UTI (avoid empiric antibiotics) <a href="https://www.vdl.ndsu.edu/wp-content/uploads/2022/02/ISCAID-Urinary-Guidelines-2019.pdf" target="_blank" rel="noopener">ISCAID 2019</a>`,
                  tele: "History/signalment/risks; order UA and urine culture; analgesia/hydration guidance; schedule sample collection.",
                  clinic:
                    "Cystocentesis UA/culture; report MICs; clinician finalizes targeted therapy and duration.",
                  notes:
                    "Culture-guided Rx; stewardship plan and signs for relapse reviewed by video.",
                },
                {
                  case: `Struvite urolith dissolution protocol (cats) <a href="https://urolithcenter.org/recommendations/53?locale=en" target="_blank" rel="noopener">MUC Struvite Dissolution</a>`,
                  tele: "Confirm radiopaque struvite prediction and absence of obstruction; prescribe dissolution diet; plan re-imaging cadence.",
                  clinic:
                    "Follow-up radiographs every 2–3 weeks; culture if progress stalls; document outcomes.",
                  notes:
                    "Dietary dissolution in weeks; prevention counseling thereafter.",
                },
                {
                  case: `New CKD workup & staging <a href="https://www.idexx.com/files/iris-pocket-guide-2.pdf" target="_blank" rel="noopener">IRIS CKD guide</a>`,
                  tele: "Screening history and differentials; order chem/UA/SDMA ± imaging; set expectations and Q&A.",
                  clinic:
                    "Bloodwork, UA, BP, ± imaging; clinic uploads results; internist stages/substages, initiates plan.",
                  notes:
                    "Tele follow-up for diet/medication titration and owner training.",
                },
                {
                  case: `Hypertension diagnosis & initiation <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6271319/" target="_blank" rel="noopener">ACVIM HTN 2018</a>`,
                  tele: "Assess TOD risks, current meds; order in-clinic serial BP, fundic exam, baseline labs; discuss targets.",
                  clinic:
                    "Standardized BP measurement on multiple visits if needed; fundic exam; baseline labs.",
                  notes:
                    "Start amlodipine (cats) or RAAS inhibition ± CCB (dogs); tele follow-up for titration.",
                },
                {
                  case: `Proteinuria confirmation & workup <a href="https://www.iris-kidney.com/iris-guidelines-1" target="_blank" rel="noopener">IRIS proteinuria</a>`,
                  tele: "History, rule-outs; order UPC (×2–3), BP, UA/culture; plan diet and RAAS strategy once confirmed.",
                  clinic:
                    "Sample collection and BP; lab processing; clinician finalizes therapy and monitoring schedule.",
                  notes:
                    "Begin ACE-i/ARB per guidelines; UPC/BP rechecks planned; tele reviews results.",
                },
                {
                  case: `AKI suspicion / obstructive LUTD triage <a href="https://pubmed.ncbi.nlm.nih.gov/38325516/" target="_blank" rel="noopener">IRIS AKI 2024</a> &nbsp;|&nbsp; <a href="https://journals.sagepub.com/doi/10.1177/1098612X241309176" target="_blank" rel="noopener">iCatCare LUTS 2025</a>`,
                  tele: "Immediate red-flag screen; direct to ER for catheterization/IV care when indicated; provide stabilization guidance en route.",
                  clinic:
                    "Decompression, labs, imaging, in-hospital monitoring; upload records.",
                  notes:
                    "Tele follow-up after discharge for prevention plan and monitoring cadence.",
                },
              ],
              note: "Example workflow: Monday video visit → Internist orders struvite-dissolution protocol and q2–3 week radiographs at Partner Clinic A; clinic imaging/results sync to the tele-internist and the client’s primary DVM.",
            },
          ],
        },
      ],
    },
    cardiologyTelemedicine: {
      mainTitle:
        "Telemedicine: Cardiology — Clinical Considerations (ACVIM Perspective)",
      mainDescription:
        "Tele-cardiology is excellent for longitudinal monitoring, caregiver training (e.g., resting respiratory rate), medication counseling, and shared decision-making. Diagnostics (echocardiography, thoracic radiographs, ECG/Holter, bloodwork, BP) are performed at partner clinics; results sync back so the primary DVM remains in the loop.",

      sections: [
        {
          id: "cardioTelemedComplete",
          title: "Cardiology: Common Follow-ups Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These follow-ups are typically managed by live video once diagnosis and baselines exist. Plans emphasize ACVIM-guided monitoring, owner-measured resting respiratory rate (RRR), and clear return precautions.",
            },
            {
              type: "table",
              caption:
                "Cardiology follow-ups commonly completed via telemedicine (education, med checks, RRR coaching)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (Cardiology/GP)" },
                { key: "rx", title: "Example eRx / monitoring" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Chronic MMVD/CHF—stable patient: home RRR coaching & med review <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6524084/" target="_blank" rel="noopener">ACVIM MMVD 2019</a> <a href="https://vcahospitals.com/know-your-pet/home-breathing-rate-evaluation" target="_blank" rel="noopener">RRR guide</a>',
                  plan: "Review appetite/energy/cough; confirm pill timing; coach accurate RRR counting and thresholds; adjust plan per signs; schedule clinic labs/imaging when due.",
                  rx: "Furosemide/torsemide per plan; pimobendan; ACE-i/spironolactone when indicated; owner RRR log/app.",
                  red: "RRR persistently above baseline (e.g., >30–35/min), increased effort, restlessness at night, anorexia/vomiting → clinic/ER.",
                },
                {
                  case: 'Preclinical MMVD Stage B1/B2—education & adherence check <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.15488" target="_blank" rel="noopener">ACVIM MMVD 2019</a> <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.14586" target="_blank" rel="noopener">EPIC (pimobendan)</a>',
                  plan: "Explain staging and monitoring; if B2, discuss EPIC criteria and pimobendan benefits; set recheck cadence and home-observation goals.",
                  rx: "Pimobendan for Stage B2; sodium-aware diet; RRR education; schedule next echo/rads with clinic.",
                  red: "New cough, breathing changes, exercise intolerance → clinic imaging/labs.",
                },
                {
                  case: 'Feline cardiomyopathy—stable outpatient counseling (HCM phenotype) <a href="https://pubmed.ncbi.nlm.nih.gov/32243654/" target="_blank" rel="noopener">ACVIM Feline CM 2020</a>',
                  plan: "Discuss phenotype/risks (CHF/ATE), activity management, medication adherence, signs to watch, RRR technique; coordinate echo/BP/labs per plan.",
                  rx: "Atenolol or clopidogrel if previously prescribed; diet/weight targets; home RRR diary.",
                  red: "Tachypnea/dyspnea, hind-limb pain/paresis (ATE), collapse → emergency exam.",
                },
                {
                  case: 'Pulmonary hypertension—tele check-in between echos <a href="https://pubmed.ncbi.nlm.nih.gov/32065428/" target="_blank" rel="noopener">ACVIM PH 2020</a>',
                  plan: "Assess exercise tolerance/cough/syncope, review concurrent disease plan (e.g., airway, thromboembolic risks), confirm med timing; schedule next echo/BP as due.",
                  rx: "Sildenafil or other PH-directed therapy per plan; adjust only against clinic data schedule.",
                  red: "Syncope increase, respiratory distress, cyanosis → in-person/ER.",
                },
                {
                  case: 'Owner training: accurate resting respiratory rate (RRR) <a href="https://veterinarypartner.vin.com/doc/?id=8401142&pid=19239" target="_blank" rel="noopener">VIN Client Handout</a> <a href="https://vhc.missouri.edu/small-animal-hospital/cardiology/at-home-monitoring-of-pets-with-heart-disease/" target="_blank" rel="noopener">University resource</a>',
                  plan: "Demonstrate RRR technique (asleep/relaxed, count full breaths ×60s), set alert thresholds, set logging cadence, tie to action plan.",
                  rx: "RRR tracker/app; written ‘call/ER’ thresholds; schedule next clinic recheck.",
                  red: "Sustained RRR >30–35/min or >20–30% above pet’s baseline over several checks → clinic/ER.",
                },
              ],
              note: "Tele-cardiology follow-ups rely on owner RRR tracking and symptom trend review; medication changes are confirmed against periodic clinic data (echocardiography, ECG, thoracic radiographs, renal/electrolytes, and blood pressure) per ACVIM guidance.",
            },
          ],
        },

        {
          id: "cardioTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Typical pathways where a video consult initiates triage/education, then a partner clinic completes diagnostics/procedures; results flow back for tele follow-up.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (Cardiology/GP)" },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'New murmur (dog): staging & treatment planning <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6524084/" target="_blank" rel="noopener">ACVIM MMVD 2019</a>',
                  tele: "History, risk discussion, explain Stage B framework and potential therapy if B2; place orders.",
                  clinic:
                    "Echocardiography ± thoracic radiographs, BP, labs; confirm stage (B1/B2).",
                  notes:
                    "If B2, start pimobendan per EPIC; tele follow-ups for RRR/med adherence.",
                },
                {
                  case: 'Preclinical MMVD Stage B2—confirm candidacy for pimobendan <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.14586" target="_blank" rel="noopener">EPIC trial</a>',
                  tele: "Review signalment/signs; discuss EPIC inclusion (cardiomegaly criteria), benefits, and monitoring; place echo/rads orders if outdated.",
                  clinic:
                    "Echo/metrics to confirm cardiomegaly; baseline labs; initiate pimobendan.",
                  notes:
                    "Tele follow-up for adherence and home monitoring; clinic rechecks per protocol.",
                },
                {
                  case: 'Suspected decompensated CHF—urgent triage <a href="https://vcahospitals.com/know-your-pet/home-breathing-rate-evaluation" target="_blank" rel="noopener">RRR guide</a>',
                  tele: "Assess effort, RRR, posture; advise immediate ER if distress; provide stabilization guidance en route.",
                  clinic:
                    "Oxygen, furosemide, imaging, labs; admit if indicated.",
                  notes:
                    "Tele recheck post-discharge to adjust home plan and RRR thresholds.",
                },
                {
                  case: 'Syncope/collapse—arrhythmia workup pathway <a href="https://www.vetmed.auburn.edu/wp-content/uploads/2018/09/AIVR-arrhythmia.pdf" target="_blank" rel="noopener">Holter/ECG note</a>',
                  tele: "Event history and video review; rule-in exertional/positional triggers; order ECG/Holter and BP.",
                  clinic:
                    "12-lead ECG, 24-hr Holter/event monitor, echocardiography; labs as indicated.",
                  notes:
                    "Rate/rhythm control plan; tele follow-ups for signs and med tolerance.",
                },
                {
                  case: 'Atrial fibrillation—rate control plan with objective monitoring <a href="https://pubmed.ncbi.nlm.nih.gov/19645836/" target="_blank" rel="noopener">Gelzer 2009</a> <a href="https://pubmed.ncbi.nlm.nih.gov/39591830/" target="_blank" rel="noopener">Romito 2025</a>',
                  tele: "Discuss targets and side effects; coordinate ECG/Holter for dose titration; review exercise videos and syncopal signs.",
                  clinic:
                    "ECG/Holter to verify ventricular rate; chemistry/electrolytes; digoxin level when used.",
                  notes:
                    "Often diltiazem+digoxin combination for control; tele maintains adherence/QoL while clinic verifies rate.",
                },
                {
                  case: 'Pulmonary hypertension—confirm and stage <a href="https://pubmed.ncbi.nlm.nih.gov/32065428/" target="_blank" rel="noopener">ACVIM PH 2020</a> <a href="https://todaysveterinarypractice.com/cardiology/pulmonary-hypertension-in-dogs/" target="_blank" rel="noopener">Review</a>',
                  tele: "Screen for signs, discuss differential (airway, thromboembolic, cardiac), place echo order and comorbidity workup.",
                  clinic:
                    "Echocardiography (TR velocity + echo signs), thoracic imaging, heartworm/thromboembolic evaluation; BP.",
                  notes:
                    "Start PH-directed therapy when indicated; tele follow-ups for tolerance and symptom trends.",
                },
                {
                  case: 'Feline murmur/tachycardia—rule-in cardiomyopathy <a href="https://pubmed.ncbi.nlm.nih.gov/32243654/" target="_blank" rel="noopener">ACVIM Feline CM 2020</a>',
                  tele: "Explain phenotype-based approach, ATE risk, stress-minimizing tactics for clinic visits; order echo/BP and labs.",
                  clinic:
                    "Echocardiography; BP/fundic exam; chemistry/thyroid as indicated.",
                  notes:
                    "Tele rechecks for adherence and early-signs coaching (RRR, appetite, activity).",
                },
              ],
              note: "Example workflow: tele consult → echo/ECG/rads/BP orders → clinic completes diagnostics and uploads results → tele follow-up to set RRR thresholds, med timing, and recheck cadence.",
            },
          ],
        },
      ],
    },
    gastroenterologyTelemedicine: {
      mainTitle:
        "Telemedicine: Gastroenterology — Clinical Considerations (SAIM/DACVIM Perspective)",
      mainDescription:
        "Tele-GI excels at diet trials, owner coaching, medication titration, and longitudinal follow-ups. Diagnostics (CBC/chem/UA, fecal tests, cobalamin/folate, cPLI/fPLI, abdominal ultrasound, endoscopy/biopsy) are routed to partner clinics; results sync back so the primary DVM stays in the loop.",

      sections: [
        {
          id: "giTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "Once baselines and differentials are set, many GI cases can be managed by live video with guideline-based diet plans, nutraceuticals, rational pharmacology, and clear red-flag instructions.",
            },
            {
              type: "table",
              caption:
                "GI cases commonly completed via telemedicine (with e-pharmacy / shared monitoring)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (SAIM/DACVIM)" },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Diet-responsive chronic enteropathy (FRE) diet trial & coaching <a href="https://www.merckvetmanual.com/digestive-system/diseases-of-the-small-intestine-in-small-animals/chronic-enteropathies-in-small-animals" target="_blank" rel="noopener">Merck CE</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10931249/" target="_blank" rel="noopener">CIE classification 2024</a>',
                  plan: "Select novel/hydrolyzed diet; strict 6–8 week trial; step-wise plan; photo/stool logs; set recheck cadence.",
                  rx: "Therapeutic diet; probiotics where appropriate; fiber per stool type; anti-nausea PRN.",
                  red: "Weight loss, hypoalbuminemia suspicion, melena/hematochezia, dehydration → clinic workup.",
                },
                {
                  case: 'Fiber-responsive large-bowel diarrhea/colitis (stable) <a href="https://www.merckvetmanual.com/digestive-system/diseases-of-the-large-intestine-in-small-animals/colitis-in-small-animals" target="_blank" rel="noopener">Merck Colitis</a>',
                  plan: "Differentiate small vs large bowel; add mixed soluble/insoluble fiber; eliminate triggers; set follow-up.",
                  rx: "Fiber supplementation; targeted diet; probiotics; short symptomatic care as needed.",
                  red: "Tenesmus with blood/mucus persisting, systemic illness, weight loss → in-clinic diagnostics ± colon workup.",
                },
                {
                  case: 'Exocrine pancreatic insufficiency (EPI) maintenance & cobalamin plan <a href="https://pubmed.ncbi.nlm.nih.gov/37944252/" target="_blank" rel="noopener">JAVMA 2023 EPI</a> <a href="https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/exocrine-pancreatic-insufficiency-in-dogs-and-cats" target="_blank" rel="noopener">Merck EPI</a>',
                  plan: "Dose enzyme powder/granules; review body-weight trends and stool quality; plan cobalamin supplementation and rechecks.",
                  rx: "Pancreatic enzymes with each meal; cobalamin supplementation when indicated; diet optimization.",
                  red: "Poor response despite adherence, weight loss, suspected concurrent disease → clinic labs/US.",
                },
                {
                  case: 'Chronic pancreatitis (stable outpatient) relapse prevention & nutrition <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.16053" target="_blank" rel="noopener">ACVIM feline pancreatitis 2021</a> <a href="https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/pancreatitis-in-dogs-and-cats" target="_blank" rel="noopener">Merck Pancreatitis</a>',
                  plan: "Low-fat diet (dogs), small frequent meals, analgesia/anti-nausea counseling; monitor triggers; schedule periodic labs via clinic.",
                  rx: "Dietary plan; anti-nausea; analgesia per primary DVM; +/- appetite support per protocol.",
                  red: "Vomiting with dehydration, abdominal pain, anorexia >24–48h → clinic for labs ± imaging.",
                },
                {
                  case: 'Post-diagnosis CE/IBD maintenance (immunomodulator step-down) <a href="https://onlinelibrary.wiley.com/doi/10.1111%2Fjvim.16690" target="_blank" rel="noopener">ACVIM feline CE 2023</a> <a href="https://wsava.org/global-guidelines/gastrointestinal-guidelines/" target="_blank" rel="noopener">WSAVA GI (histopath)</a>',
                  plan: "Symptom scoring, adverse-effect check, taper strategy, diet adherence, cobalamin plan; schedule clinic labs per protocol.",
                  rx: "Prednisolone/budesonide or alternative per prior plan; diet; B12 supplementation when indicated.",
                  red: "Progressive weight loss, effusion/ascites, persistent vomiting/diarrhea → clinic restaging.",
                },
                {
                  case: 'GERD/esophagitis-suspect: rational GI protectant use (short courses) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6271318/" target="_blank" rel="noopener">ACVIM GI-protectants 2018</a>',
                  plan: "Assess triggers, meal timing/elevation, trial short-course acid suppression only when indicated; avoid indefinite therapy without diagnosis.",
                  rx: "PPI/H2RA short course when appropriate; sucralfate for mucosal support; feeding strategy.",
                  red: "Dysphagia, regurg with weight loss, aspiration risk → clinic imaging ± endoscopy.",
                },
                {
                  case: 'Feline idiopathic constipation (non-obstructive) home plan <a href="https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2021/12/TVP-2022-0102_Feline_Constipation_Nutrition.pdf" target="_blank" rel="noopener">TVP 2022</a>',
                  plan: "Hydration, fiber vs osmotic laxative strategy, stool diary, litterbox optimization, activity plan; define when to escalate.",
                  rx: "PEG 3350 or lactulose per DVM; fiber/diet adjustments; water-intake tactics (wet food/fountain).",
                  red: "Pain/straining with no stool, anorexia or vomiting, suspected megacolon → clinic ± enemas/radiographs.",
                },
                {
                  case: 'Giardiasis—post-diagnosis treatment & environment control <a href="https://capcvet.org/guidelines/giardia/" target="_blank" rel="noopener">CAPC Giardia</a> <a href="https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2021/04/TVP-2021-0506_Parasitology_Giardia.pdf" target="_blank" rel="noopener">TVP Giardia</a>',
                  plan: "Review positive test, treat pet(s) per guideline, bathe on treatment days, clean environment, retest only if signs persist.",
                  rx: "Fenbendazole or metronidazole per CAPC; hygiene plan; manage co-pets as indicated.",
                  red: "Persistent diarrhea/weight loss despite therapy → clinic for further workup.",
                },
                {
                  case: 'Owner education: small- vs large-bowel pattern & when to worry <a href="https://www.merckvetmanual.com/digestive-system/diseases-of-the-small-intestine-in-small-animals/chronic-enteropathies-in-small-animals" target="_blank" rel="noopener">Merck CE</a>',
                  plan: "Teach pattern recognition (frequency/urgency/mucus vs volume/weight loss), hydration checks, diet adherence; set return precautions.",
                  rx: "Dietary and fiber guidance; probiotics where appropriate; written action plan.",
                  red: "Any systemic illness, blood, dehydration, or poor response → in-clinic evaluation.",
                },
                {
                  case: 'Chronic hepatitis (medical management follow-ups) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6524396/" target="_blank" rel="noopener">ACVIM Canine CH 2019</a>',
                  plan: "Review signs and labs trend (done at clinic), nutrition/copper strategy, hepatoprotectants; schedule lab cadence.",
                  rx: "Ursodiol; SAMe/silybin; copper-restricted diet/chelator where indicated.",
                  red: "Icterus progression, ascites, encephalopathy signs → in-person diagnostics.",
                },
              ],
              note: "Antimicrobial stewardship: reserve antibiotics for documented indications; most chronic enteropathies are diet- or immune-mediated rather than infectious.",
            },
          ],
        },

        {
          id: "giTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Typical pathways where a video consult initiates triage/differentials and owner coaching, then a partner clinic completes diagnostics or procedures; results flow back for tele follow-up.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (SAIM/DACVIM)" },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'Chronic vomiting/weight loss—rule-out IBD vs small-cell lymphoma <a href="https://onlinelibrary.wiley.com/doi/10.1111%2Fjvim.16690" target="_blank" rel="noopener">ACVIM feline CE 2023</a> <a href="https://wsava.org/global-guidelines/gastrointestinal-guidelines/" target="_blank" rel="noopener">WSAVA GI (histopath)</a>',
                  tele: "Pattern history, diet review, shared decision on testing; order labs/fecal/cobalamin; discuss imaging/biopsy options.",
                  clinic:
                    "CBC/chem/UA, fecal tests, T4 (cats), abdominal ultrasound; endoscopy/biopsy if indicated with WSAVA scoring.",
                  notes:
                    "Tele follow-up to interpret results and set diet/immunomodulator plan.",
                },
                {
                  case: 'Suspected pancreatitis (dog/cat) <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.16053" target="_blank" rel="noopener">ACVIM feline pancreatitis 2021</a> <a href="https://www.merckvetmanual.com/digestive-system/the-exocrine-pancreas/pancreatitis-in-dogs-and-cats" target="_blank" rel="noopener">Merck Pancreatitis</a>',
                  tele: "Triage severity; start anti-nausea/hydration advice; place orders for pancreatic lipase test and imaging.",
                  clinic:
                    "cPLI/fPLI, abdominal ultrasound, electrolytes; hospitalization if moderate/severe.",
                  notes:
                    "Tele rechecks for nutrition plan and relapse prevention.",
                },
                {
                  case: 'Non-responsive chronic diarrhea—parasitology & stewardship pathway <a href="https://capcvet.org/guidelines/giardia/" target="_blank" rel="noopener">CAPC Giardia</a>',
                  tele: "History, prior diet/empirics review; place multi-modal fecal testing; set diet/fiber plan until results.",
                  clinic:
                    "Fecal antigen/ELISA ± PCR, flotation; targeted therapy per results; consider further GI workup if persistent.",
                  notes:
                    "Tele follow-up for response monitoring and step-up plan.",
                },
                {
                  case: 'Suspected protein-losing enteropathy (PLE) <a href="https://www.merckvetmanual.com/digestive-system/diseases-of-the-small-intestine-in-small-animals/chronic-enteropathies-in-small-animals" target="_blank" rel="noopener">Merck CE</a>',
                  tele: "Screen red flags (effusion, edema, weight loss); place labs and imaging orders; review hospitalization triggers.",
                  clinic:
                    "Albumin/chemistry, ultrasound ± endoscopy/biopsy, fecal diagnostics; start appropriate therapy.",
                  notes:
                    "Tele to maintain diet/meds and plan albumin monitoring cadence.",
                },
                {
                  case: 'Constipation/megacolon—failed home plan (cats) <a href="https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2021/12/TVP-2022-0102_Feline_Constipation_Nutrition.pdf" target="_blank" rel="noopener">TVP 2022</a>',
                  tele: "Confirm failure of laxatives/hydration; triage appetite/pain; arrange urgent in-clinic care.",
                  clinic:
                    "Enema/deobstipation under sedation, radiographs, +/- hospitalization; discuss long-term plan.",
                  notes:
                    "Tele follow-up for diet/medication strategy and relapse prevention.",
                },
                {
                  case: 'Foreign body/obstruction suspicion—emergency pathway <a href="https://www.aaha.org/resources/2018-aaha-infection-control-prevention-and-biosecurity-guidelines/phone-triage/" target="_blank" rel="noopener">AAHA triage</a>',
                  tele: "Red-flag screen (projectile vomiting, painful abdomen, no stool/gas); direct to ER; give stabilization guidance en route.",
                  clinic:
                    "Radiographs/US, labs, decompression/surgery as indicated.",
                  notes:
                    "Post-discharge tele check-in to set diet re-intro and complication watch.",
                },
              ],
              note: "Example workflow: tele consult → order labs/fecal/US → clinic completes testing (± endoscopy) → results sync back → tele follow-up to set diet/immunomodulator plan and monitoring cadence.",
            },
          ],
        },
      ],
    },
    pulmonologyRespiratoryTelemedicine: {
      mainTitle:
        "Telemedicine: Pulmonology & Respiratory — Clinical Considerations (DACVIM-SAIM Perspective)",
      mainDescription:
        "Tele-respiratory care is excellent for longitudinal management (owner coaching, medication titration, environment control) once a diagnosis and baseline have been established. Diagnostics that require hands-on acquisition (thoracic radiographs, echocardiography, ECG/Holter, airway sampling, bronchoscopy, oxygen therapy) are performed at partner clinics and then followed up by video.",

      sections: [
        {
          id: "pulmoRespTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These problems are typically managed by live video with guideline-based home plans and clear return precautions; e-prescribing to the client’s chosen pharmacy is used when appropriate.",
            },
            {
              type: "table",
              caption:
                "Respiratory cases commonly completed via telemedicine (with e-pharmacy / shared monitoring)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (Pulmonology/SAIM)" },
                { key: "rx", title: "Example eRx / at-home care" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Feline asthma—maintenance & inhaler technique coaching <a href="https://pubmed.ncbi.nlm.nih.gov/31812220/" target="_blank" rel="noopener">Review 2020</a> <a href="https://todaysveterinarypractice.com/wp-content/uploads/sites/4/2018/04/TVP-2018-0506_Asthmatic_Cat.pdf" target="_blank" rel="noopener">TVP Guideline</a>',
                  plan: "Assess cough/wheeze frequency, trigger control, spacer/mask fit; set action plan for flares; cadence for clinic rechecks/rads.",
                  rx: "Inhaled corticosteroid ± bronchodilator; short oral steroid taper only when indicated; environmental allergen/smoke control.",
                  red: "Tachypnea/dyspnea, cyanosis, refractory flare, poor inhaler tolerance → clinic/ER.",
                },
                {
                  case: 'Canine chronic bronchitis—stable maintenance <a href="https://www.merckvetmanual.com/dog-owners/lung-and-airway-disorders-of-dogs/bronchitis-in-dogs" target="_blank" rel="noopener">Merck Vet Manual</a>',
                  plan: "Symptom scoring, weight & exercise plan, cough-suppressant timing, trigger avoidance; schedule periodic imaging/labs at clinic.",
                  rx: "Anti-inflammatory plan per prior workup; antitussive for dry cough; airway humidification; weight loss when needed.",
                  red: "Respiratory distress, fever/lethargy, suspected pneumonia, hemoptysis.",
                },
                {
                  case: 'Mild, uncomplicated CIRDC (“kennel cough”)—home isolation & supportive care <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7132485/" target="_blank" rel="noopener">CIRDC review</a> <a href="https://www.merckvetmanual.com/respiratory-system/respiratory-diseases-of-small-animals/kennel-cough" target="_blank" rel="noopener">Merck</a>',
                  plan: "Infectious precautions, rest, humidification; stewardship: avoid empiric antibiotics unless pneumonia suspected; define recheck triggers.",
                  rx: "Antitussive for dry/nonproductive cough if appropriate; hydration, short work/leash walks only.",
                  red: "Productive/wet cough with fever, tachypnea/dyspnea, anorexia/lethargy → clinic imaging and labs.",
                },
                {
                  case: 'Tracheal/airway collapse—owner coaching (no acute distress) <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.17117" target="_blank" rel="noopener">JVIM 2024 meta-analysis</a> <a href="https://www.vetsmall.theclinics.com/article/S0195-5616%2819%2930170-6/abstract" target="_blank" rel="noopener">Review</a>',
                  plan: "Harness (no neck collars), weight reduction, heat/excitement management, cough-suppression strategy; set imaging/fluoroscopy cadence via clinic.",
                  rx: "Antitussive for nonproductive cough; anti-inflammatory plan per DVM; bronchodilator only if indicated; ± anxiolytic before triggers.",
                  red: "Cyanosis, syncope, severe dyspnea, refractory cough → urgent in-person care.",
                },
                {
                  case: 'Post-pneumonia convalescent follow-up—home plan & tapering <a href="https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-small-animals/pneumonia-in-dogs-and-cats" target="_blank" rel="noopener">Merck</a> <a href="https://todaysveterinarypractice.com/respiratory-medicine/treating-bacterial-pneumonia-in-dogs-and-cats/" target="_blank" rel="noopener">TVP 2024</a>',
                  plan: "Review appetite/energy/fever logs, exercise re-intro, cough trend; confirm timing for follow-up rads and culture per clinic plan.",
                  rx: "Antimicrobials only per culture/duration plan; nebulization/coupage as taught; short leash activity; hydration.",
                  red: "Relapsing fever, increased effort/tachypnea, anorexia, new productive cough → re-image and reassess.",
                },
                {
                  case: 'Owner training: measure resting/sleeping respiratory rate (RRR/SRR) <a href="https://vcahospitals.com/know-your-pet/home-breathing-rate-evaluation" target="_blank" rel="noopener">VCA RRR</a>',
                  plan: "Teach counting full breaths at rest/asleep; document baseline and alert thresholds; tie to action plan and when to call/ER.",
                  rx: "RRR diary/app; written thresholds; pair with clinic recheck schedule.",
                  red: "Sustained RRR above baseline (often >30–35/min) or labored breathing → clinic/ER.",
                },
                {
                  case: 'Brachycephalic airway syndrome (BOAS)—non-urgent counseling <a href="https://www.merckvetmanual.com/respiratory-system/respiratory-diseases-of-small-animals/overview-of-respiratory-diseases-of-dogs-and-cats" target="_blank" rel="noopener">Merck overview</a>',
                  plan: "Heat avoidance, weight targets, exercise modulation, stress control; discuss indications/timing for surgical evaluation at a partner clinic.",
                  rx: "Lifestyle & environmental changes; reflux/anti-inflammatory support only if previously indicated by DVM.",
                  red: "Collapse, cyanosis, heat stress, progressive stridor → immediate in-person care.",
                },
                {
                  case: 'Post-tracheal stent long-term check-ins (stable) <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.17117" target="_blank" rel="noopener">JVIM 2024 meta-analysis</a>',
                  plan: "Assess cough severity, exercise tolerance, complications screening; coordinate scheduled imaging/bronchoscopy with clinic.",
                  rx: "Antitussives and anti-inflammatories as prescribed; airway hygiene; trigger avoidance.",
                  red: "Granuloma/suspected infection, increased cough/dyspnea → in-person imaging and culture.",
                },
                {
                  case: 'Chronic cough—owner trigger audit & environment plan <a href="https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-small-animals/overview-of-respiratory-diseases-of-dogs-and-cats" target="_blank" rel="noopener">Merck overview</a>',
                  plan: "Audit smoke/aerosols/dust/cleaners; humidification plan; schedule clinic diagnostics if cough persists beyond set window.",
                  rx: "Environmental controls; antitussive or anti-inflammatory only when indicated by prior diagnosis.",
                  red: "Worsening frequency, fever, weight loss, tachypnea/dyspnea → in-clinic workup.",
                },
              ],
              note: "Stewardship: avoid routine empiric antibiotics for uncomplicated coughs; pursue imaging and diagnostics when red flags appear or signs persist (see CIRDC and pneumonia references below).",
            },
          ],
        },

        {
          id: "pulmoRespTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Typical pathways where a video consult initiates triage/education and orders; a partner clinic then completes diagnostics/procedures. Results sync back for tele follow-up.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                {
                  key: "tele",
                  title: "Telemedicine actions (Pulmonology/SAIM)",
                },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'New-onset cough/dyspnea—rule-in cardiac vs respiratory <a href="https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-small-animals/overview-of-respiratory-diseases-of-dogs-and-cats" target="_blank" rel="noopener">Merck overview</a>',
                  tele: "History/video review; red-flag screen; order thoracic rads ± NT-proBNP/echo pathway; set isolation if infectious suspected.",
                  clinic:
                    "Thoracic radiographs, minimum database; echo/ECG if indicated; oxygen if distressed.",
                  notes:
                    "Tele follow-up to interpret results and set home plan; escalate if deterioration.",
                },
                {
                  case: 'Suspected pneumonia (infectious or aspiration) <a href="https://www.msdvetmanual.com/respiratory-system/respiratory-diseases-of-small-animals/pneumonia-in-dogs-and-cats" target="_blank" rel="noopener">Merck</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7114575/" target="_blank" rel="noopener">Review</a>',
                  tele: "Triage severity; hydration and nursing guidance; place orders for rads, CBC/chem, and airway sampling if needed.",
                  clinic:
                    "Thoracic rads; tracheal wash/BAL for culture when indicated; oxygen and hospitalization as needed.",
                  notes:
                    "Culture-guided therapy and duration; tele rechecks to monitor trend and taper plan.",
                },
                {
                  case: 'Pulmonary hypertension—confirmation & staging <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.15725" target="_blank" rel="noopener">ACVIM PH 2020</a>',
                  tele: "Screen for syncope/exercise intolerance and comorbidities; order echocardiography, thoracic imaging, BP, and infectious testing as indicated.",
                  clinic:
                    "Echo (TR velocity, ancillary echo signs), rads, BP; initiate PH-directed therapy when appropriate.",
                  notes:
                    "Tele follow-ups for symptom trend and med tolerance; periodic clinic echo per guideline.",
                },
                {
                  case: 'Feline asthma—initial staging (diagnosis) <a href="https://pubmed.ncbi.nlm.nih.gov/31812220/" target="_blank" rel="noopener">Review 2020</a> <a href="https://todaysveterinarypractice.com/respiratory-medicine/asthma-in-cats-management-guidelines/" target="_blank" rel="noopener">TVP</a>',
                  tele: "Pattern history, trigger mapping, spacer education; place orders for thoracic rads ± airway sampling based on severity.",
                  clinic:
                    "Thoracic radiographs; ± airway sampling and cytology; baseline labs.",
                  notes:
                    "Tele follow-up to start inhaled steroid plan, define flare protocol, and monitoring cadence.",
                },
                {
                  case: 'Chronic cough—rule-in chronic bronchitis vs airway collapse <a href="https://www.vetsmall.theclinics.com/article/S0195-5616%2819%2930170-6/abstract" target="_blank" rel="noopener">Airway collapse review</a> <a href="https://www.merckvetmanual.com/dog-owners/lung-and-airway-disorders-of-dogs/bronchitis-in-dogs" target="_blank" rel="noopener">Bronchitis (Merck)</a>',
                  tele: "Collar/harness audit, trigger inventory; place orders for rads ± fluoroscopy/bronchoscopy; set expectations.",
                  clinic:
                    "Thoracic rads; ± fluoroscopy, bronchoscopy/BAL; culture if indicated; initiate targeted plan.",
                  notes:
                    "Tele to fine-tune antitussive/anti-inflammatory strategy and lifestyle controls.",
                },
                {
                  case: 'Recurrent CIRDC / multi-pet outbreak—diagnostic & biosecurity plan <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7132485/" target="_blank" rel="noopener">CIRDC review</a>',
                  tele: "Isolation protocol and contact tracing; order respiratory PCR panel via clinic; define when to escalate.",
                  clinic:
                    "Swab collection for PCR; targeted therapy for severe/complicated cases; public-facing precautions if needed.",
                  notes:
                    "Tele to interpret panel results, adjust isolation window, and set return-to-normal plan.",
                },
              ],
              note: "Example workflow: tele consult → thoracic radiographs + (when indicated) echo/PCR/BAL at Partner Clinic → results upload → tele follow-up for home plan, recheck cadence, and red-flag thresholds.",
            },
          ],
        },
      ],
    },
    neurologyTelemedicine: {
      mainTitle:
        "Telemedicine: Neurology — Clinical Considerations (DACVIM-Neurology Perspective)",
      mainDescription:
        "Tele-neurology excels at longitudinal counseling (seizure diaries & action plans, cognitive dysfunction support, benign movement/vestibular follow-ups) and coordinated pathways where advanced diagnostics occur at partner clinics and results flow back for video follow-ups.",

      sections: [
        {
          id: "neuroTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These problems are typically managed by live video once an initial diagnosis/baseline exists, with guideline-based home plans, owner logs, and clear red-flag instructions.",
            },
            {
              type: "table",
              caption:
                "Neurology cases commonly completed via telemedicine (with e-pharmacy / shared monitoring)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (Neurology/GP)" },
                { key: "rx", title: "Example eRx / at-home tools" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Canine epilepsy—stable maintenance (owner seizure diary, action plan) <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0464-z" target="_blank" rel="noopener">IVETF AED consensus</a> <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0462-1" target="_blank" rel="noopener">IVETF Dx approach</a>',
                  plan: "Review diary (frequency/cluster status), triggers, post-ictal changes; adjust antiseizure meds against periodic labs arranged through clinic; discuss emergency plan and home-safety.",
                  rx: "Phenobarbital/levetiracetam/imepitoin etc. per prior plan; owner seizure log/app; written emergency thresholds.",
                  red: "Status epilepticus, clusters, new neuro deficits, medication tox signs → ER/in-clinic evaluation.",
                },
                {
                  case: 'Owner education: seizure detection & logging tech <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8711717/" target="_blank" rel="noopener">Owner perceptions study</a>',
                  plan: "Teach reliable counting/recording; choose device/app; set “call/ER” thresholds; tie to dose-adjust and recheck schedule.",
                  rx: "Seizure log/app; calendar reminders for trough levels; written action plan.",
                  red: "Any increase in frequency/severity or trauma during events → clinic/ER.",
                },
                {
                  case: 'Idiopathic vestibular disease—recovery coaching (after initial triage) <a href="https://www.frontiersin.org/articles/10.3389/fvets.2023.1263976/full" target="_blank" rel="noopener">IVS review 2023</a> <a href="https://veterinarypartner.vin.com/doc/?id=4951444&pid=19239" target="_blank" rel="noopener">VIN client handout</a>',
                  plan: "Explain typical acute onset and improvement window; anti-nausea plan coordinated with clinic; home-safety and recheck cadence with photos/video.",
                  rx: "Antiemetic/anti-nausea if prescribed; assisted feeding/hydration; floor-level confinement and sling support.",
                  red: "Non-improving/worsening vestibular signs, severe anorexia, new neuro deficits → in-clinic imaging workup.",
                },
                {
                  case: 'Canine cognitive dysfunction (CDS)—home environment & medical plan <a href="https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/2023-aaha-senior-care-guidelines-for-dogs-and-cats/resources/2023-aaha-senior-care-guidelines-for-dogs-and-cats.pdf" target="_blank" rel="noopener">AAHA Senior 2023</a> <a href="https://www.nature.com/articles/s41598-022-15837-9" target="_blank" rel="noopener">DAP cognitive score</a>',
                  plan: "Screen DISHA-A signs, sleep and anxiety; optimize enrichment, lighting, routines; discuss nutraceuticals/diets/meds; periodic tele follow-ups.",
                  rx: "Dietary (MCT/antioxidants) & supplements; selegiline/trazodone or similar when indicated; enrichment & schedule.",
                  red: "Rapid progression, daytime disorientation with accidents or unsafe behavior → in-clinic assessment for differentials.",
                },
                {
                  case: 'Idiopathic head tremor syndrome (benign) counseling <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.16880" target="_blank" rel="noopener">JVIM 2023</a> <a href="https://www.mspca.org/angell_services/idiopathic-head-tremor-syndrome/" target="_blank" rel="noopener">Angell explainer</a>',
                  plan: "Review video to differentiate from focal seizures; reassure benign course; distraction techniques; avoid unnecessary AEDs.",
                  rx: "None typically; train “distract with treat/name” during episodes; monitor with video diary.",
                  red: "Change in pattern, other neuro deficits, persistent episodes → in-clinic workup.",
                },
                {
                  case: 'Generalized tremor syndrome (steroid-responsive) long-term follow-up <a href="https://www.frontiersin.org/articles/10.3389/fvets.2024.1453698/full" target="_blank" rel="noopener">Frontiers 2024</a> <a href="https://vcahospitals.com/know-your-pet/shaker-syndrome-in-dogs" target="_blank" rel="noopener">VCA overview</a>',
                  plan: "Assess relapse risk and taper plan set by clinic; review triggers and nursing care; tele check-ins during steroid weans.",
                  rx: "Immunomodulatory plan per primary/neurologist; GI protectants if needed; exercise & stress modulation.",
                  red: "Fever, pain, worsening tremors, steroid adverse effects → in-person evaluation & labs.",
                },
                {
                  case: 'Post-op neuro or post-diagnosis stable rechecks (owner coaching) <a href="https://www.bsava.com/article/canine-intervertebral-disc-disease-how-much-do-we-really-know/" target="_blank" rel="noopener">BSAVA IVDD overview</a>',
                  plan: "Medication adherence, sling/harness use, floor-plan modifications, bladder care coaching; set in-clinic suture removal/radiograph schedule.",
                  rx: "Pain control per surgeon/primary; PT/home-exercise handouts; environmental safety adjustments.",
                  red: "Acute deterioration (pain, paresis, incontinence), pressure sores, urinary issues → in-clinic check.",
                },
              ],
              note: "For controlled drugs, follow state law: many jurisdictions require an in-person exam before prescribing or refilling controlled substances via telehealth.",
            },
          ],
        },

        {
          id: "neuroTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Typical pathways where a video consult initiates triage/education and orders; a partner clinic then completes diagnostics/procedures. Results sync back for tele follow-up.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (Neurology/GP)" },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'First seizure (adult dog/cat)—IVETF workup pathway <a href="https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-015-0462-1" target="_blank" rel="noopener">IVETF Dx approach</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4552272/" target="_blank" rel="noopener">IVETF definitions</a>',
                  tele: "History/video review; rule-out toxin/trauma triage; place orders for MDB (CBC/chem/UA), BP, bile acids (as indicated), and advanced imaging if structural disease suspected; seizure-safety counseling.",
                  clinic:
                    "Baseline labs, BP; ± MRI/CSF if indicated; AED initiation per findings; trough level schedule.",
                  notes:
                    "Tele follow-ups for diary review and dose titration against clinic labs.",
                },
                {
                  case: 'Suspected steroid-responsive meningitis-arteritis (SRMA) <a href="https://pubmed.ncbi.nlm.nih.gov/37704169/" target="_blank" rel="noopener">SRMA review 2023</a> <a href="https://onlinelibrary.wiley.com/doi/10.1111/jsap.13775" target="_blank" rel="noopener">MRI features 2024</a>',
                  tele: "Screen fever/neck pain/age; discuss differentials and risks; order CBC/CRP and referral for MRI±CSF; start analgesia plan per local protocol.",
                  clinic:
                    "MRI ± CSF (infectious rule-outs), inflammatory panel; initiate immunosuppressive regimen; schedule monitoring.",
                  notes:
                    "Tele taper checks, relapse education, and adverse-effect monitoring.",
                },
                {
                  case: 'Myasthenia gravis (MG) suspicion—weakness/megaesophagus pathway <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12038433/" target="_blank" rel="noopener">AChR Ab test (gold standard)</a> <a href="https://vetneuromuscular.ucsd.edu/cases/2008/August.html" target="_blank" rel="noopener">UCSD NM case</a>',
                  tele: "Video of exercise-induced weakness/regurg; aspiration-risk counseling; order AChR antibody test ± thoracic rads and thyroid panel; discuss pyridostigmine trial only when supervised.",
                  clinic:
                    "Blood draw for AChR Ab; radiographs for megaesophagus/aspiration; start therapy and monitor response.",
                  notes:
                    "Tele for dose-tuning and aspiration-prevention coaching; clinic for crises.",
                },
                {
                  case: 'Acute spinal pain/paresis—IVDD triage & referral <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11946308/" target="_blank" rel="noopener">IVDD review 2025</a> <a href="https://www.bsava.com/article/canine-intervertebral-disc-disease-how-much-do-we-really-know/" target="_blank" rel="noopener">BSAVA overview</a>',
                  tele: "Video gait review and pain history; strict rest instructions; place orders for neuro exam & advanced imaging at partner clinic; discuss surgical vs conservative.",
                  clinic:
                    "Hands-on neuro exam; MRI/CT-myelo; surgeon consult; bladder care as needed.",
                  notes:
                    "Tele follow-ups for home nursing, PT progression, and relapse prevention.",
                },
                {
                  case: 'Idiopathic vestibular—initial diagnosis confirmation & anti-nausea plan <a href="https://www.frontiersin.org/articles/10.3389/fvets.2023.1263976/full" target="_blank" rel="noopener">IVS review 2023</a>',
                  tele: "Pattern recognition & red-flag screen; order baseline labs and rads if atypical; coach supportive care; schedule recheck video.",
                  clinic:
                    "If atypical or non-improving: rads, labs, ± MRI/CSF; dispense anti-nausea meds; hydration support.",
                  notes:
                    "Most improve in days to weeks; tele monitors trajectory and safety.",
                },
              ],
              note: "Example workflow: tele consult → orders for labs/MRI/CSF as indicated → clinic completes diagnostics and uploads results → tele follow-up for medication plan, owner coaching, and recheck cadence.",
            },
          ],
        },
      ],
    },
    hematologyImmunologyTelemedicine: {
      mainTitle:
        "Telemedicine: Hematology & Immunology — Clinical Considerations (DACVIM-SAIM / AVHTM Perspective)",
      mainDescription:
        "Tele-hematology/immunology works well for longitudinal counseling, medication adherence/titration with clinic-based labs, transfusion reaction follow-ups, and client education on bleeding/thrombotic risk. Diagnostics that require samples, imaging, hospitalization, transfusion, or procedures occur at partner clinics; results then flow back for video follow-ups.",

      sections: [
        {
          id: "hemoImmunoTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These problems are typically managed by live video once a diagnosis/baseline exists, with guideline-based home plans, scheduled clinic labs, and clear red-flag instructions.",
            },
            {
              type: "table",
              caption:
                "Hematology/Immunology cases commonly completed via telemedicine (with e-pharmacy / shared monitoring)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                {
                  key: "plan",
                  title: "Telemedicine plan (SAIM/Heme-Immunology)",
                },
                { key: "rx", title: "Example eRx / at-home tools" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Stable IMHA—maintenance & taper check-ins <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6524099/" target="_blank" rel="noopener">ACVIM IMHA Tx 2019</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6430921/" target="_blank" rel="noopener">ACVIM IMHA Dx 2019</a>',
                  plan: "Review gum color/energy/appetite logs; discuss steroid-sparing strategy; line up periodic CBC/chem via partner clinic; thrombosis risk review.",
                  rx: "Glucocorticoid taper per protocol; consider cyclosporine/azathioprine (dogs) when indicated; antithrombotic per risk.",
                  red: "Pale/icteric gums, tachypnea, collapse, melena/hematemesis, rapid drop in energy → clinic/ER.",
                },
                {
                  case: 'Stable ITP—bleeding surveillance & taper plan <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.16996" target="_blank" rel="noopener">ACVIM ITP Dx 2024</a> <a href="https://onlinelibrary.wiley.com/doi/full/10.1111/jvim.17079" target="_blank" rel="noopener">ACVIM ITP Tx 2024</a>',
                  plan: "Owner checks for petechiae, ecchymoses, epistaxis; schedule platelet rechecks at partner clinic; activity restriction coaching.",
                  rx: "Glucocorticoid taper; add-on immunosuppressants when indicated; GI protection as needed.",
                  red: "Mucosal bleeding, neuro signs, melena/hematuria, lethargy → immediate in-person care.",
                },
                {
                  case: 'Thromboprophylaxis adherence in high-risk patients (e.g., PLE/PLN/heartworm, select IMHA) <a href="https://pubmed.ncbi.nlm.nih.gov/30654416/" target="_blank" rel="noopener">CURATIVE antithrombotics 2019</a>',
                  plan: "Risk-tier review, side-effect screen, drug-drug interactions; ensure scheduled labs at clinic (renal, hepatic, CBC).",
                  rx: "Clopidogrel or rivaroxaban per risk tier and comorbidities; written bleed-risk precautions.",
                  red: "New dyspnea, limb pain/swelling, neuro deficits, bleeding signs → urgent evaluation.",
                },
                {
                  case: 'FeLV/FIV-positive cat—long-term care & household counseling <a href="https://catvets.com/resource/feline-retrovirus-management-guidelines/" target="_blank" rel="noopener">AAFP Retrovirus 2020</a>',
                  plan: "Discuss indoor-only living, testing of cohabiting cats, vaccine strategy, stress reduction, nutrition; schedule periodic clinic labs.",
                  rx: "Preventives; supportive meds per comorbidities; client education handouts.",
                  red: "Weight loss, fever, pallor/bleeding, respiratory distress → clinic assessment.",
                },
                {
                  case: 'von Willebrand disease (vWD)—non-urgent counseling & surgical planning <a href="https://www.vet.cornell.edu/animal-health-diagnostic-center/laboratories/comparative-coagulation/clinical-topics/canine-von-willebrand-disease" target="_blank" rel="noopener">Cornell Coagulation</a> <a href="https://todaysveterinarynurse.com/hematology/a-veterinary-nurses-guide-to-von-willebrand-disease/" target="_blank" rel="noopener">TVN 2025</a>',
                  plan: "Review subtype/testing, procedure risk planning, medication avoidance list; coordinate clinic blood typing/cross-match if needed.",
                  rx: "Peri-procedural DDAVP for Type 1 when appropriate; plan for cryo/FFP availability via clinic.",
                  red: "Active bleeding, trauma, planned invasive procedure without products → in-clinic care.",
                },
                {
                  case: 'Post-transfusion at-home monitoring (delayed reactions) <a href="https://pubmed.ncbi.nlm.nih.gov/33792171/" target="_blank" rel="noopener">AVHTM TRACS 2021</a> <a href="https://www.merckvetmanual.com/circulatory-system/blood-groups-and-blood-transfusions-in-dogs-and-cats/blood-transfusions-in-dogs-and-cats" target="_blank" rel="noopener">Merck Transfusion</a>',
                  plan: "Tele check-ins at 24–72h and 7–14d: appetite, attitude, urine color, breathing, temp; arrange clinic PCV/TS as scheduled.",
                  rx: "Home monitoring diary; written signs of acute vs delayed reactions; meds only per DVM.",
                  red: "Fever, pigmenturia, dyspnea, hives/facial swelling, rapid PCV drop → stop meds if advised and go to clinic/ER.",
                },
                {
                  case: 'Owner education: bleeding signs & home logs (IMHA/ITP/antithrombotics) <a href="https://onlinelibrary.wiley.com/doi/10.1111/vec.13045" target="_blank" rel="noopener">TRACS prevention/monitoring</a>',
                  plan: "Teach mucosal checks, stool/urine surveillance, bruise diary; set thresholds for calling/ER; align with clinic lab cadence.",
                  rx: "Printed action plan; synchronized reminders for labs/med timing.",
                  red: "Any new bleeding, collapse, severe lethargy → in-person evaluation.",
                },
                {
                  case: 'Immunosuppressant side-effect surveillance (steroids/cyclosporine, etc.) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6524099/" target="_blank" rel="noopener">ACVIM IMHA Tx 2019</a>',
                  plan: "GI/PU-PD/behavior checks, infection vigilance; coordinate periodic CBC/chem/UA via clinic; taper discussions.",
                  rx: "Dose adjustments per plan; GI protectants when indicated; infection precautions.",
                  red: "Vomiting with blood, severe diarrhea, fever, profound lethargy → clinic/ER.",
                },
              ],
              note: "Telemedicine is ideal for education, adherence, and safety monitoring; labs/imaging/transfusions occur at partner clinics with results routed back for tele follow-ups.",
            },
          ],
        },

        {
          id: "hemoImmunoTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Typical pathways where a video consult initiates triage/education and orders; a partner clinic then completes diagnostics/procedures. Results sync back for tele follow-up.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                {
                  key: "tele",
                  title: "Telemedicine actions (SAIM/Heme-Immunology)",
                },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'Suspected IMHA (pallor/icterus, pigmenturia) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6430921/" target="_blank" rel="noopener">ACVIM IMHA Dx 2019</a> <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6524099/" target="_blank" rel="noopener">ACVIM IMHA Tx 2019</a>',
                  tele: "History/photos (mucous membranes/urine), red-flag screen; place orders for CBC/retic/smear, saline agglutination, biochem/UA; thrombosis-risk counsel.",
                  clinic:
                    "Vitals, MDB, imaging as indicated; transfusion readiness; immunosuppressive/antithrombotic initiation per protocol.",
                  notes:
                    "Tele follow-ups for taper plan, thrombosis monitoring; scheduled rechecks via clinic.",
                },
                {
                  case: 'Suspected ITP (petechiae, mucosal bleeding) <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.16996" target="_blank" rel="noopener">ACVIM ITP Dx 2024</a> <a href="https://onlinelibrary.wiley.com/doi/full/10.1111/jvim.17079" target="_blank" rel="noopener">ACVIM ITP Tx 2024</a>',
                  tele: "Bleeding inventory and activity restriction; orders for CBC ± imaging to exclude internal bleeding; discuss transfusion thresholds.",
                  clinic:
                    "CBC/coat/abdominal-thoracic imaging as indicated; immunosuppression initiation; product support if needed.",
                  notes:
                    "Tele to guide dose adjustments and bleeding surveillance once stable.",
                },
                {
                  case: 'Suspected anticoagulant rodenticide coagulopathy <a href="https://www.merckvetmanual.com/toxicology/rodenticide-poisoning/anticoagulant-rodenticide-warfarin-and-congeners-poisoning-in-animals" target="_blank" rel="noopener">Merck Vets</a> <a href="https://www.vet.cornell.edu/animal-health-diagnostic-center/laboratories/comparative-coagulation/clinical-topics/vitamin-k-therapy" target="_blank" rel="noopener">Cornell Vit K</a>',
                  tele: "Exposure history, bleeding screen, strict rest, household safety counsel; place orders for PT/INR and radiographs if dyspnea.",
                  clinic:
                    "Coag testing, vitamin K1 initiation and dosing, product support (FFP/whole blood) when indicated; recheck schedule.",
                  notes:
                    "Tele checks for adherence and late bleed after K1 stops; clinic re-test 48h after discontinuation.",
                },
                {
                  case: 'Transfusion planning—anemia/coagulopathy <a href="https://journals.sagepub.com/doi/10.1177/1098612X211007071" target="_blank" rel="noopener">ISFM Feline Transfusion 2021</a> <a href="https://onlinelibrary.wiley.com/doi/10.1111/vec.13044" target="_blank" rel="noopener">TRACS Part 1</a>',
                  tele: "Discuss indications/risks, obtain consent, home monitoring plan; coordinate timing with clinic.",
                  clinic:
                    "Type/cross-match, transfusion administration and monitoring per TRACS; immediate/24–48h post checks.",
                  notes:
                    "Tele follow-ups to review late signs and lab trends; update action plan.",
                },
                {
                  case: 'FeLV/FIV initial testing & confirmation pathway <a href="https://catvets.com/resource/feline-retrovirus-management-guidelines/" target="_blank" rel="noopener">AAFP Retrovirus 2020</a> <a href="https://pubmed.ncbi.nlm.nih.gov/31916872/" target="_blank" rel="noopener">PubMed</a>',
                  tele: "Pre-test counseling, risk audit, isolation advice for multi-cat homes; order ELISA and confirmatory testing.",
                  clinic:
                    "Sample collection, point-of-care testing, confirmatory assays; baseline staging labs.",
                  notes:
                    "Tele to interpret results, household plan, and set monitoring cadence.",
                },
              ],
              note: "Example workflow: tele consult → orders for CBC/coags/type & cross or FeLV/FIV testing → partner clinic performs diagnostics/transfusion as needed → results upload → tele follow-up for meds, safety, and recheck cadence.",
            },
          ],
        },
      ],
    },
    infectiousDiseasesTelemedicine: {
      mainTitle:
        "Telemedicine: Infectious Diseases — Clinical Considerations (SAIM/ID Perspective)",
      mainDescription:
        "Tele-infectious disease is well suited to triage, prevention counseling, outbreak control, treatment adherence, and follow-ups tied to clinic-based diagnostics. Antibiotic stewardship applies: many canine/feline URI/CIRDC cases are viral and do not warrant antibiotics unless bacterial complications are evidenced by exam or tests.",

      sections: [
        {
          id: "idTelemedComplete",
          title: "Example Cases Completed via Telemedicine",
          blocks: [
            {
              type: "paragraph",
              text: "These scenarios are typically handled by live audio-video with client education, isolation/prevention advice, supportive care plans, and e-pharmacy where appropriate. Escalation triggers and recheck cadence are explicitly documented.",
            },
            {
              type: "table",
              caption:
                "ID cases commonly completed via telemedicine (with e-pharmacy / prevention plans)",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "plan", title: "Telemedicine plan (SAIM/ID)" },
                { key: "rx", title: "Typical home care / eRx" },
                { key: "red", title: "Red flags → in-person" },
              ],
              rows: [
                {
                  case: 'Mild CIRDC (“kennel cough”)—uncomplicated, no distress <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5354050/" target="_blank" rel="noopener">ISCAID Resp 2017</a> <a href="https://catvets.com/wp-content/uploads/2024/01/2022-AAFP-AAHA-Antimicrobial-Guidelines.pdf" target="_blank" rel="noopener">AAHA/AAFP AMS 2022</a>',
                  plan: "History, exposure map, isolation/hygiene, cough monitoring; avoid empiric antibiotics unless bacterial complications suspected.",
                  rx: "Humidification, rest, harness use; antitussive only if appropriate and patient stable.",
                  red: "Tachypnea/dyspnea, fever, lethargy, productive cough with distress → clinic imaging/labs.",
                },
                {
                  case: 'Feline URI (mild; likely FHV/FCV) <a href="https://catvets.com/wp-content/uploads/2024/01/2022-AAFP-AAHA-Antimicrobial-Guidelines.pdf" target="_blank" rel="noopener">AAHA/AAFP AMS 2022</a>',
                  plan: "Supportive care coaching (nutrition, hydration, nasal cleansing), stress reduction, eye monitoring; consider famciclovir when indicated.",
                  rx: "Saline lubricants, appetite support; famciclovir if clinician deems appropriate.",
                  red: "Marked anorexia/dehydration, dyspnea, corneal ulceration/purulent nasal discharge.",
                },
                {
                  case: 'Parasite prevention & travel medicine (ticks/heartworm/geo-risks) <a href="https://capcvet.org/guidelines/general-guidelines/" target="_blank" rel="noopener">CAPC General 2025</a>',
                  plan: "Risk-based prevention plan, product selection, testing cadence; travel destination tick/heartworm brief.",
                  rx: "Year-round preventives (region-appropriate); client reminders and testing schedule.",
                  red: "New fever/lameness/bleeding tendency post-tick exposure → clinic testing.",
                },
                {
                  case: 'Household ringworm (dermatophytosis) decontamination coaching (post-Dx) <a href="https://wavd.org/wp-content/uploads/summary-of-clinical-consensus-guidelines-dermatophytosis.pdf" target="_blank" rel="noopener">WAVD Derm 2017</a> <a href="https://www.cdc.gov/ringworm/causes/index.html" target="_blank" rel="noopener">CDC Ringworm</a>',
                  plan: "Zoonosis education, cleaning protocol, laundry and surface disinfection cadence; monitor lesions via photos.",
                  rx: "Topical therapy refills per prior plan; environmental disinfectant guidance.",
                  red: "Expanding lesions, folliculitis, immunocompromised household members becoming symptomatic.",
                },
                {
                  case: 'Feeding-handling hygiene for GI pathogens (Giardia, etc.)—post-Dx maintenance <a href="https://capcvet.org/guidelines/giardia/" target="_blank" rel="noopener">CAPC Giardia</a>',
                  plan: "Bathing after diarrhea episodes, prompt feces removal, yard sanitation; test-of-cure timing discussion.",
                  rx: "Metronidazole or fenbendazole only if already prescribed/indicated; probiotic plan; recheck window.",
                  red: "Persistent/worsening diarrhea, weight loss, hematochezia → clinic fecal panel.",
                },
                {
                  case: 'Lyme prevention counseling in endemic/travel areas <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5980284/" target="_blank" rel="noopener">ACVIM Lyme 2018</a>',
                  plan: "Tick avoidance, daily checks, prophylaxis selection; dog testing cadence; owner bite prevention.",
                  rx: "Isoxazoline preventives; discuss regional vaccination policy where applicable.",
                  red: "Acute shifting-leg lameness, fever, thrombocytopenia signs → clinic diagnostics.",
                },
                {
                  case: 'Vaccine-preventable respiratory risks (Bordetella, CIV) counseling <a href="https://wsava.org/global-guidelines/vaccination-guidelines/" target="_blank" rel="noopener">WSAVA Vaccines 2024</a>',
                  plan: "Facility/travel risk audit; boarding/daycare show-me list; update plan timing.",
                  rx: "Book vaccine update at partner clinic; written isolation plan during outbreaks.",
                  red: "Cough with distress, cyanosis, anorexia → in-person assessment.",
                },
                {
                  case: 'Post-antibiotic stewardship check-ins (any infection) <a href="https://catvets.com/wp-content/uploads/2024/01/2022-AAFP-AAHA-Antimicrobial-Guidelines.pdf" target="_blank" rel="noopener">AAHA/AAFP AMS 2022</a>',
                  plan: "Review course completion, adverse effects, culture-guided changes; reinforce narrow-spectrum use.",
                  rx: "Documented stop dates; probiotic/supportive care if appropriate.",
                  red: "Relapse, new fever, GI intolerance → clinic recheck/culture.",
                },
              ],
              note: "Antibiotics are not indicated for most viral URIs/CIRDC without evidence of secondary bacterial infection. Use culture/point-of-care tests and clear return precautions.",
            },
          ],
        },

        {
          id: "idTelemedHybrid",
          title:
            "Telemedicine consultation/plan with in-Clinic follow-up lab/treatments",
          blocks: [
            {
              type: "paragraph",
              text: "Video consult initiates exposure triage, isolation measures, and orders. Partner clinic performs samples, imaging, and procedures. Results sync back for tele follow-ups.",
            },
            {
              type: "table",
              caption:
                "Start via telemedicine; complete key diagnostics or procedures at partner clinic",
              responsive: "auto",
              stackBreakpoint: 640,
              rowHeaders: false,
              columns: [
                { key: "case", title: "Case" },
                { key: "tele", title: "Telemedicine actions (SAIM/ID)" },
                { key: "clinic", title: "Clinic tasks & diagnostics" },
                { key: "notes", title: "Typical outcome" },
              ],
              rows: [
                {
                  case: 'Suspected bacterial UTI (dysuria/hematuria) <a href="https://www.vdl.ndsu.edu/wp-content/uploads/2022/02/ISCAID-Urinary-Guidelines-2019.pdf" target="_blank" rel="noopener">ISCAID UTI 2019</a>',
                  tele: "Symptom inventory, prior history, AMR/stewardship counsel, order UA + culture before antibiotics.",
                  clinic:
                    "Cystocentesis UA/culture, possible imaging if recurrent/complicated.",
                  notes:
                    "Targeted therapy based on culture; tele follow-up for response and stop date.",
                },
                {
                  case: 'Suspected leptospirosis (PU/PD, fever, azotemia, myalgia) <a href="https://onlinelibrary.wiley.com/doi/10.1111/jvim.16903" target="_blank" rel="noopener">ACVIM Lepto 2023</a>',
                  tele: "Immediate exposure counseling, household risk mitigation; order MAT/PCR + chem/UA; start appropriate precautions.",
                  clinic:
                    "Isolation, diagnostics, early antimicrobial therapy, fluid/supportive care.",
                  notes:
                    "Tele follow-up for renal recovery plan, household disinfection guidance.",
                },
                {
                  case: 'Tick-borne disease suspicion (Lyme/ehrlichiosis/anaplasmosis) <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5980284/" target="_blank" rel="noopener">ACVIM Lyme 2018</a>',
                  tele: "Exposure map, clinical screen, order SNAP/serology + CBC/chem/UA; discuss co-infections.",
                  clinic:
                    "Bloodwork/serology; urine protein screen where indicated; treatment per guidelines.",
                  notes:
                    "Tele to monitor response/adverse effects; adjust plan with lab results.",
                },
                {
                  case: 'Pneumonia vs. complicated CIRDC <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5354050/" target="_blank" rel="noopener">ISCAID Resp 2017</a>',
                  tele: "Red-flag recognition, isolation, order thoracic rads/CBC; antimicrobial stewardship brief.",
                  clinic:
                    "Imaging, oxygen as needed, culture (e.g., BAL) when indicated; targeted therapy.",
                  notes:
                    "Tele follow-ups for taper timing and activity progression.",
                },
                {
                  case: 'Dermatophytosis diagnosis/clearance testing pathway <a href="https://wavd.org/wp-content/uploads/summary-of-clinical-consensus-guidelines-dermatophytosis.pdf" target="_blank" rel="noopener">WAVD Derm 2017</a>',
                  tele: "Household risk/cleaning protocol, clip/isolation advice; order fungal culture/PCR.",
                  clinic:
                    "Sampling (toothbrush technique), Wood’s lamp, culture/PCR; baseline photos.",
                  notes:
                    "Tele to review results, continue/stop therapy, and finalize environmental decontamination.",
                },
                {
                  case: 'Parvoviral enteritis (canine/feline panleukopenia) suspected <a href="https://www.merckvetmanual.com/digestive-system/infectious-diseases-of-the-gastrointestinal-tract-in-small-animals/canine-parvovirus-infection-parvoviral-enteritis-in-dogs" target="_blank" rel="noopener">Merck Vet Parvo</a> <a href="https://wsava.org/global-guidelines/vaccination-guidelines/" target="_blank" rel="noopener">WSAVA Vaccines 2024</a>',
                  tele: "Immediate isolation, sanitation coaching, order POC antigen test and baseline labs.",
                  clinic:
                    "POC testing, hospitalization with fluids/antiemetics/antibiotics as indicated; biosecurity.",
                  notes:
                    "Tele to counsel on prognosis and vaccine-preventable nature for contacts.",
                },
                {
                  case: 'Rabies exposure triage (public health coordination) <a href="https://www.cdc.gov/rabies/hcp/veterinarians/index.html" target="_blank" rel="noopener">CDC—Vets & Rabies</a>',
                  tele: "Exposure assessment, isolation of suspect animals, immediate public health contact and owner instructions.",
                  clinic:
                    "Report as required; quarantine/booster or testing per jurisdiction.",
                  notes:
                    "Tele follow-ups for quarantine compliance and symptom checks.",
                },
                {
                  case: 'Suspected giardiasis (diarrhea) needing confirmation <a href="https://capcvet.org/guidelines/giardia/" target="_blank" rel="noopener">CAPC Giardia</a>',
                  tele: "Diet/hydration support; order fecal flotation with centrifugation ± ELISA/PCR (multi-day sampling).",
                  clinic:
                    "Collect/submit fecal samples; dispense therapy after confirmation.",
                  notes:
                    "Tele to reinforce environmental control and test-of-cure timing.",
                },
              ],
              note: "Example: tele triage → orders (UA/culture, MAT/PCR, rads, fecal tests) → partner clinic performs diagnostics/isolation/treatment → results sync → tele follow-up for adherence, adverse effects, and prevention.",
            },
          ],
        },
      ],
    },
  },

  contributors: {
    ourContributors: {
      mainTitle: "Vetcation Contributors",
      mainDescription:
        "Vetcation is shaped by the passion, expertise, and collaboration of dedicated individuals from across the veterinary and technology fields. This section highlights the contributors who have helped bring our vision to life. We list our contributors in alphabetical order to honor their unique contributions and the diverse backgrounds they bring to Vetcation.",
      sections: [
        {
          id: "coreTeam",
          title: "Team",
          blocks: [
            {
              type: "customContributorList",
              contributors: [
                {
                  name: "Geoff Chih-Fan Chen",
                  title: "Founder of Vetcation",
                  description:
                    "Geoff Chih-Fan Chen, a former astrophysicist at UCLA, leveraged his expertise to build the core infrastructure of the Vetcation platform. Inspired by Dr. Fuchi Yu, he combined advanced technology with clinical insight to help advance telemedicine in the veterinary field.",
                },
                {
                  name: "Mingli Lee",
                  title: "UX Designer",
                  description:
                    "Mingli Lee made significant contributions to the UX design during the early stages of the Vetcation product. Since then, she has continued to support the evolution of the platform by refining app workflows and actively participating in product direction brainstorming.",
                },

                {
                  name: "Dr. Fuchi Yu",
                  title: "Veterinarian at Overland Veterinary Clinic",
                  description:
                    "Dr. Fuchi Yu is a veterinarian at Overland Veterinary Clinic and has played a key role in supporting the development of the Vetcation platform. Her clinical insights and frontline experience have been instrumental in shaping Vetcation’s telemedicine services.",
                },

                // More contributors...
              ],
            },
          ],
        },
        {
          id: "interns",
          title: "Interns",
          blocks: [
            {
              type: "customContributorList",
              contributors: [
                {
                  name: "Jackson Konkle",
                  title: "Marketing Intern",
                  description:
                    "Jackson Konkle is a Marketing Intern at Vetcation, bringing a passion for storytelling and experience in content creation, social media strategy, and community outreach. Currently studying Business Information Management at UC Irvine, Jackson is helping Vetcation grow its community and expand access to veterinary knowledge and care.",
                },
              ],
            },
          ],
        },
        {
          id: "advisors",
          title: "Advisors",
          blocks: [
            {
              type: "customContributorList",
              contributors: [
                {
                  name: "Dr. Jeremy Prupas",
                  title: "Chief Veterinarian at City of Los Angeles",
                  description:
                    "Dr. Jeremy Prupas has provided key strategic guidance that helped steer Vetcation toward telemedicine. His connections with organizations such as AlignCare, SCVMA, and veterinary hospitals helped align the platform with broader efforts to advance virtual care in the veterinary field.",
                },

                // More contributors...
              ],
            },
          ],
        },
        {
          id: "contributors",
          title: "Contributors",
          blocks: [
            {
              type: "customContributorList",
              contributors: [
                {
                  name: "Dr. Ross Massimiano",
                  title: "Veterinarian at Veterinary Emergency Group (VEG)",
                  description:
                    "Dr. Ross Massimiano has helped check the workflow of the Vetcation platform and provided valuable feedback on the features. His insights have been crucial in ensuring that the platform meets the needs of both veterinary professionals and pet owners.",
                },
                {
                  name: "Emily Schmieder",
                  title:
                    "Licensed Veterinary Technician at Benfield Animal Hospital",
                  description:
                    "Emily Schmieder, a licensed veterinary technician, contributed significantly to the design of the Vetssenger feature—Vetcation’s chargeable, inquiry-based messaging system. Her input was instrumental in shaping a workflow that supports both veterinary professionals and pet owners.",
                },
                {
                  name: "Dr. Ying Tsou",
                  title: "Veterinarian at Norco Animal Hospital",
                  description:
                    "Dr. Ying Tsou has provided valuable feedback on the telemedicine features of the Vetcation platform. His insights have been essential in ensuring that the platform effectively supports both veterinary professionals and pet owners.",
                },
                {
                  name: "Tahnee Morris",
                  title: "Hospital Manager at Animal Hospital of Redondo Beach",
                  description:
                    "Based on Tahnee Morris’s guidance, we expanded the virtual professional network to include qualified non-DVM services. This enhancement allows providers to affiliate with clinics for increased trust and deliver coordinated support for clients.",
                },
                {
                  name: "Dr. Polly Chen",
                  title: "Veterinarian",
                  description:
                    "Dr. Polly Chen recommended surfacing telemedicine outcomes analysis. Previously available only at the clinic level, the app now provides every doctor with their own outcomes dashboard and adds a metric showing how many patients they’ve connected with over their career.",
                },

                // More contributors...
              ],
            },
          ],
        },
      ],
    },
  },

  oneHealth: {
    introToOneHealth: {
      mainTitle: "Collaborations for One Health Impact",
      mainDescription: `We partner with public agencies, nonprofits, and community leaders to keep more pets with their people and strengthen veterinary teams. Our focus: expand access to care, reduce preventable surrenders, improve post-adoption outcomes, and protect clinician well-being. Each collaboration aligns with Vetcation’s platform strengths—virtual care, coordinated follow-ups, and transparent data—while honoring the missions of our partners.`,

      sections: [
        {
          id: "ohvsPrupas",
          title:
            "One Health Veterinary Solutions (Dr. Jeremy Prupas, VMD, MPH)",
          blocks: [
            {
              type: "paragraph",
              text: "We’re working with Dr. Jeremy Prupas to co-design scalable, equity-driven One Health programs that integrate veterinary and public-health services. The goal: keep pets with families, reduce shelter intake, and build community resilience.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: [
                    "One Health Veterinary Solutions (Founder: Dr. Jeremy Prupas, VMD, MPH; former Chief Veterinarian, LA City Animal Services).",
                  ],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Design and pilot integrated virtual-to-in-person care pathways that reduce preventable surrenders and improve access for underserved families.",
                  ],
                },
                {
                  heading: "Initial Joint Initiatives:",
                  lines: [
                    "Map a shelter-to-community virtual care loop (triage → telemedicine → in-person handoff) with clear escalation rules.",
                    "Use Vetcation’s time-boxed messaging and video visits for follow-ups to protect staff time and increase continuity.",
                    "Define metrics: prevented surrenders, resolved cases without ER visits, clinician workload reduction, client satisfaction.",
                  ],
                },
                {
                  heading: "Why It Matters:",
                  lines: [
                    "Two out of three surrenders could be prevented; 94% of assisted owners kept their pets (Hill’s 2024). Empathy plus coordination works.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "alignCare",
          title: "AlignCare — Access to Care for Low-Income Families",
          blocks: [
            {
              type: "paragraph",
              text: "We are exploring an integration with AlignCare to combine financial assistance models with coordinated virtual care and clinic handoffs.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: ["AlignCare (Prospective Integration)."],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Increase access to timely veterinary advice and appropriate treatment pathways for families with financial constraints.",
                  ],
                },
                {
                  heading: "Program Focus:",
                  lines: [
                    "Virtual triage and follow-ups to avoid unnecessary ER visits.",
                    "Structured handoffs for imaging, labs, dentistry, and surgery at participating hospitals.",
                    "Transparent data for outcomes and funding impact.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "dvSafetyNet",
          title: "Municipal Partnership — Domestic Violence Pet Safety-Net",
          blocks: [
            {
              type: "paragraph",
              text: "We support municipal efforts to protect the pets of survivors by building a fast, private, and reliable care pathway.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: [
                    "City DV Programs and Community Partners (Prospective).",
                  ],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Ensure survivors’ pets receive immediate care, temporary housing support, and medical continuity without barriers.",
                  ],
                },
                {
                  heading: "Program Focus:",
                  lines: [
                    "Rapid telemedicine consults and documentation that travel with the pet.",
                    "Coordinated referrals to partner hospitals and boarding programs.",
                    "Privacy-preserving processes and clear points of contact.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "oneHealthCoordinator",
          title: "One Health Coordinator Model — Cross-Agency Integration",
          blocks: [
            {
              type: "paragraph",
              text: "Inspired by Dr. Prupas’s framework, we support a city-level One Health Coordinator role that bridges Animal Services, Police, Fire, and Social Services.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: [
                    "Municipal Agencies and Public-Health Departments (Prospective).",
                  ],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Create a single point of accountability for pet-and-people solutions: prevention, response, and follow-through.",
                  ],
                },
                {
                  heading: "Program Focus:",
                  lines: [
                    "Station social workers in shelters; coordinate outreach and case tracking.",
                    "Hold One Health clinics for families and pets; expand reimbursements to recruit more hospitals.",
                    "Use shared dashboards to monitor outcomes and funding needs.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "housingRetention",
          title: "Housing & Pet Retention — Policy and Private Partnerships",
          blocks: [
            {
              type: "paragraph",
              text: "Housing insecurity is a leading cause of surrender. We aim to support policy partners and property stakeholders with pragmatic solutions.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: [
                    "City Housing Offices, Property Networks, Advocacy Groups (Prospective).",
                  ],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Reduce pet-related evictions and surrenders via incentives, verification, and responsible-pet frameworks.",
                  ],
                },
                {
                  heading: "Program Focus:",
                  lines: [
                    "Pet-friendly incentives (stipends, tax benefits) tied to spay/neuter, licensing, and microchipping.",
                    "Virtual behavior consults to stabilize tenancies and address complaints early.",
                    "Clear documentation and data to demonstrate cost savings.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "shelterBehavior",
          title: "Shelter Behavioral Support and Return-to-Home",
          blocks: [
            {
              type: "paragraph",
              text: "Behavior drives many relinquishment decisions. Early, expert guidance can keep pets home and improve adoptability.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: [
                    "Certified Trainer Networks (IAABC, KPA), Shelter Partners (Prospective).",
                  ],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Offer low- or no-cost training touchpoints and train-the-trainer models to multiply reach.",
                  ],
                },
                {
                  heading: "Program Focus:",
                  lines: [
                    "Virtual intake and follow-ups post-adoption.",
                    "RTH (Return-to-Home) systems with clear owner outreach and documentation.",
                    "Outcome tracking to refine curricula.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "communityPrevention",
          title: "Community Prevention Clinics and Reimbursement Expansion",
          blocks: [
            {
              type: "paragraph",
              text: "Prevention saves lives and budgets. We support vaccination, spay/neuter, and basic care access with a strong data backbone.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Collaborator:",
                  lines: [
                    "Public-private Funders, Hospital Networks (Prospective).",
                  ],
                },
                {
                  heading: "Mission:",
                  lines: [
                    "Scale preventive care while attracting more hospitals through better reimbursement and low-friction workflows.",
                  ],
                },
                {
                  heading: "Program Focus:",
                  lines: [
                    "Virtual pre-screening, scheduling, and post-clinic follow-ups.",
                    "Claims and outcomes transparency to sustain funding.",
                    "Shared knowledge to reduce duplication across programs.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "getInvolved",
          title: "Get Involved",
          blocks: [
            {
              type: "paragraph",
              text: "If you’re working in veterinary medicine, public health, animal welfare, housing, or social services, we’d love to connect. Together, we can align incentives, protect veterinary teams, and keep more pets with their people.",
            },
          ],
        },
      ],
    },
  },

  clinics: {
    clinicIntroToVetcation: {
      mainTitle: "Introduction for Hospitals",
      mainDescription: `Vetcation enables California veterinary hospitals to launch a legally compliant hospital-branded virtual branch in days with zero workflow changes. Partner with your own vets and hospital’s relief veterinarians to expand capacity, keep full ownership of client relationships and medical records, and add a new revenue stream with a transparent per-visit clinic share. When escalation to in-person care is needed, your hospital takes over using your standard workflows. Our mission is to help clinics build one-tap-away, lasting client relationships, end burnout across the team, and dramatically decrease turnover.`,
      sections: [
        {
          id: "mission",
          title: "Our Mission",
          blocks: [
            {
              type: "paragraph",
              text: 'Vetcation is designed to address one of the biggest problems in veterinary hospitals: <span class="highlight">high turnover</span>. Most teams are overworked and understaffed, and when client conflict and an overload of callbacks pile up, these pressures become primary drivers of burnout and contribute to high turnover. Reducing client volume to ease pressure sacrifices already thin margins, making it harder to pay competitive wages and keep good employees, which in turn leads to underpayment and makes hiring and retention more difficult.',
            },
            {
              type: "root",
              helpText: `We believe the solution is to expand teams without additional payroll to handle appropriate cases, create a new revenue stream to fund competitive wages, and focus in-house teams on high-value cases that truly require hands-on care, including imaging, lab diagnostics, dentistry, and surgery. The Vetcation platform enables clinics to achieve this by partnering with your trusted relief veterinarians to expand capacity. The added revenue supports more competitive compensation for in-house staff and improves service for in-person clients, which ultimately reduces burnout across the team and dramatically lowers turnover. The higher the staff satisfaction, the better the patient outcomes.`,
            },
          ],
        },
        {
          id: "achieveForClinics",
          title: "What Can Your Hospital Achieve with Vetcation?",
          blocks: [
            {
              type: "paragraph",
              text: "Partner with trusted relief veterinarians, certified trainers, and board-certified specialists to expand capacity, offer new services, protect staff time, and keep ownership of client relationships and medical records.",
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1039.webp?alt=media&token=0f3f8557-ca8e-4ba9-bd4b-6ebf3f797f88",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0848.webp?alt=media&token=402221cd-81a0-45ee-8df2-f39e618494f9",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Launch fast, keep your workflows:",
                  lines: [
                    "Stand up a hospital-branded virtual branch in days and continue using your intake, scheduling, and treatment processes.",
                  ],
                },
                {
                  heading: "Expand capacity without extra payroll:",
                  lines: [
                    "Partner with your relief veterinarians to handle appropriate virtual cases and smooth peak demand without adding fixed headcount. The more relief vets you partner with, the more appointment slots your clients can access.",
                  ],
                },
                {
                  heading: "Expand services without new hires:",
                  lines: [
                    "Partner with certified dog trainers and board-certified specialists so clients can access behavior consults, dermatology, oncology, and more directly under your hospital’s brand. Offer advanced expertise without the cost of staffing specialists in-house.",
                  ],
                },
                {
                  heading: "Focus in-house teams on high-value care:",
                  lines: [
                    "Reserve on-site time for cases that truly need in-person care, including imaging, ultrasound, bloodwork, dentistry under anesthesia, and surgery.",
                  ],
                },
                // {
                //   heading: "Reduce callback overload:",
                //   lines: [
                //     "Move follow-ups into compensated, time-boxed messaging and video so clinicians are protected from endless phone tag.",
                //   ],
                // },
                {
                  heading: "Keep ownership and continuity:",
                  lines: [
                    "Your hospital owns the client relationship and records. Escalations hand off seamlessly into your standard on-site workflow.",
                  ],
                },
                {
                  heading: "Add a new revenue stream:",
                  lines: [
                    "Earn a transparent per-visit clinic share while virtual cases also drive appropriate in-person services.",
                  ],
                },
                {
                  heading: "Ensure compliance with AB 1399:",
                  lines: [
                    "Vetcation’s infrastructure aligns with California’s telehealth law, AB 1399, providing automated documentation and audit readiness so your practice stays compliant as it grows.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1031.webp?alt=media&token=7a81a522-f6cd-4428-b1d5-81ea4e609754",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0853.webp?alt=media&token=420b61b1-454e-48da-a1c0-0bbc98b2ac20",
              ],
            },
          ],
        },

        {
          id: "whyVirtualCareTrend",
          title: "Why Virtual Care Is Growing — And Why It Matters",
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
                    `Over 22% of U.S. counties have no veterinary employees, leaving millions of companion animals in underserved areas (VVCA Report 2024, p. 7).`,
                    `The country faces a deficit of 12,000 veterinarians and 48,000 support staff, demanding innovative solutions like telemedicine (VVCA Report 2024, p. 7).`,
                  ],
                },
                {
                  heading: "Rapid Consumer Adoption:",
                  lines: [
                    "Telehealth has become a key access point for pet owners seeking immediate answers — 50% of global virtual consults address symptomatic issues (VVCA Report 2024, p. 10).",
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
                    "Virtual interactions garner an average 98.4% satisfaction rate — pet owners appreciate the convenience and immediate access to professional advice (VVCA Report 2024, p. 14).",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    VirtualBranch: {
      mainTitle: "Set Up Your Virtual Branch with Vetcation",
      mainDescription: `The following steps explain how you can sign up as a hospital/organization account, claim your hospital, sign the required legal documents, and manage partnerships with relief veterinarians. We also cover how your account can view visit outcomes and how to handle escalated cases that require in-person follow-up care.`,
      sections: [
        {
          id: "SignUp",
          title: "Sign Up as a Hospital/Organization Account",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0828.webp?alt=media&token=6c2de185-8eb8-4f19-afc2-168dbec6810b",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0830.webp?alt=media&token=d0e41069-a189-4084-9f3c-8d69473aafbb",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Select 'Hospital/Organization' Account Type:",
                  lines: [
                    "Choose the 'Hospital/Organization' option during sign-up to create your clinic's account. Make sure you are the authorized representative to set up the account.",
                  ],
                },
                {
                  heading: "Scan the provided QR Code:",
                  lines: [
                    "Scan the QR code provided or email to gcfchen@vetcation.com to request a QR code.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "claimHospital",
          title: "Claim Your Hospital and Set Up Your Profile",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0832.webp?alt=media&token=85deb6e8-028a-4517-b89a-6822eda65a1d",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0834.webp?alt=media&token=2a07b279-cbab-4a21-b70f-1ed35e465af7",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Search for Your Hospital:",
                  lines: [
                    "Use the search function to find your hospital by zip code. Select your hospital. If your hospital is not listed, contact gcfchen@vetcation.com for assistance.",
                  ],
                },
                {
                  heading: "Complete Hospital Profile:",
                  lines: [
                    "Fill out your hospital's profile with accurate information. This information will be visible to clients.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "legalDocs",
          title: "Sign Legal Documents",
          blocks: [
            {
              type: "framedImage",
              // heading: "Sample: Updating Your Legal Profile",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0837.webp?alt=media&token=82ef47cf-c7f4-400d-98d1-0b2d20360fa0",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0838.webp?alt=media&token=a5db0d17-48f7-4bd3-bdaf-a5a64fdd8bb7",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Find Legal Documents:",
                  lines: [
                    "Slide right to open the drawer menu and press 'Telemedicine settings' to access the required inputs for telemedicine services.",
                  ],
                },
                {
                  heading: "Complete Required Inputs:",
                  lines: [
                    "Fill out all required fields, including authorized representative name, phone number, and hospital address.",
                    "Carefully read through the EULA. Electronically sign the documents to complete the process.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "partnerReliefVets",
          title: "Manage requested Partner with Relief Veterinarians",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0839.webp?alt=media&token=cb65b265-1c74-42ea-a8d8-bea0a09f2e38",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0841.webp?alt=media&token=56d65d8d-1b38-4358-9fdd-a0009239d335",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1039.webp?alt=media&token=0f3f8557-ca8e-4ba9-bd4b-6ebf3f797f88",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Approve partnership requests",
                  lines: [
                    "Relief vets may send requests to partner with your hospital.",
                    "You can review, approve, or decline requests from your hospital account on the map.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "SendRequestReliefVets",
          title: "Send Partnership Requests to Relief Veterinarians",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0847.webp?alt=media&token=007fd8c3-a56c-4545-aba8-76649f22b4c2",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0845.webp?alt=media&token=ebd22e27-7272-41a7-aea0-6e74698394e7",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0846.webp?alt=media&token=8387fb7a-5c63-4c09-8564-a6ee375e554e",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Invite trusted vets",
                  lines: [
                    "Search for relief veterinarians by name.",
                    "Send invitations to relief veterinarians you already work with to join your hospital’s virtual branch.",
                    "Once they accept, they will be listed as a telemedicine vet under your hospital’s profile.",
                  ],
                },
              ],
            },
          ],
        },
        // {
        //   id: "viewOutcomes",
        //   title: "View Visit Outcomes",
        //   blocks: [
        //     {
        //       type: "qa",
        //       question:
        //         "Can my hospital see the medical records from virtual appointments?",
        //       answer:
        //         "Yes. For any telemedicine visit connected to your hospital, you can view the consult records, notes, and recommendations. These remain part of your client’s official medical record.",
        //     },
        //   ],
        // },
        // {
        //   id: "handleEscalations",
        //   title: "Handle Escalated Cases",
        //   blocks: [
        //     {
        //       type: "bulletList",
        //       items: [
        //         {
        //           heading: "When a case needs in-person care",
        //           lines: [
        //             "If a relief vet escalates a case, your hospital takes over immediately.",
        //             "You then schedule the in-person appointment and continue with your standard workflows.",
        //           ],
        //         },
        //         {
        //           heading: "Seamless handoff",
        //           lines: [
        //             "Clients remain within your hospital’s care, ensuring continuity and full record ownership.",
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
        {
          id: "doneHospital",
          title: "Done!",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading:
                    "Your hospital is now live with its own virtual branch and can start supporting clients with relief vet coverage instantly.",
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0837.webp?alt=media&token=82ef47cf-c7f4-400d-98d1-0b2d20360fa0",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0848.webp?alt=media&token=402221cd-81a0-45ee-8df2-f39e618494f9",
              ],
            },
          ],
        },
      ],
    },

    clinicOutcomeAnalysis: {
      mainTitle: "Clinic Outcome Analytics",
      mainDescription: `See how telemedicine is performing across your account and by doctor. Track client growth, outcome distribution, and drill down to the exact visits behind each outcome.`,
      sections: [
        {
          id: "clientGrowth",
          title: "Client growth (last 4 weeks)",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0850.webp?alt=media&token=2b09333e-b495-4f1a-9597-0cab3594b7ec",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0854.webp?alt=media&token=3362662c-1b60-4138-8f84-ccefacf04994",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Total clients:",
                  lines: ["Count of unique pet owners linked to your account."],
                },
                {
                  heading: "New (4W):",
                  lines: ["New clients who joined in the last 4 weeks."],
                },
              ],
            },
          ],
        },

        {
          id: "telemedOutcomesAll",
          title: "Telemedicine outcomes — account",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0851.webp?alt=media&token=c15ec67a-9dec-40a2-b47e-cf861a74ed06",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Prescribed meds:",
                  lines: ["Visit resulted in a prescription."],
                },
                {
                  heading: "Escalate to in-person:",
                  lines: ["Telemed triage recommended in-clinic exam."],
                },
                {
                  heading: "Refer other doctors:",
                  lines: ["Directed to a different clinician/specialist."],
                },
                {
                  heading: "ER:",
                  lines: ["Advised emergency care based on triage."],
                },
                {
                  heading: "Monitor:",
                  lines: ["No immediate intervention; monitor with guidance."],
                },
                {
                  heading: "Resolved:",
                  lines: ["Issue addressed within the telemedicine visit."],
                },
              ],
            },
          ],
        },

        {
          id: "telemedOutcomesByDoctor",
          title: "Telemedicine outcomes — by doctor",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0852.webp?alt=media&token=06d6f20c-0002-4600-a57c-8c8f8b8f9187",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0853.webp?alt=media&token=420b61b1-454e-48da-a1c0-0bbc98b2ac20",
              ],
            },
          ],
        },

        {
          id: "outcomeDrilldowns",
          title: "Drill down to visits behind each outcome",
          blocks: [
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0851.webp?alt=media&token=c15ec67a-9dec-40a2-b47e-cf861a74ed06",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0855.webp?alt=media&token=17eeca01-c874-42a3-a442-a764402bee96",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Audit trail:",
                  lines: [
                    "Every outcome links to the visit card for QA and follow-up.",
                  ],
                },
                {
                  heading: "Operational handoffs:",
                  lines: [
                    "Escalations hand back to your clinic’s standard workflow.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    ReferralClinic: {
      mainTitle: "Telemedicine Referral Clinic Network Overview",
      mainDescription: `Vetcation makes it easy for your clinic to support pet owners who are referred for in-person care following a telemedicine consultation. By joining our Referral Clinic Network, your clinic can be selected by virtual veterinarians on our platform when a patient near your location requires physical examination, diagnostics, or treatment. You will receive a summary of the consultation along with relevant medical records to guide your team’s in-person care.`,
      sections: [
        {
          id: "referralNetwork",
          title: "Vetcation’s Referral Clinic Network",
          blocks: [
            {
              type: "paragraph",
              text: "Vetcation’s Referral Clinic Network is designed to connect virtual veterinarians with local clinics that can provide in-person care. This network allows pet owners to receive timely and appropriate care while ensuring that clinics have the opportunity to support their community.",
            },
            {
              type: "map",
              collectionName: "clinics", // 👈 use this instead of markers
              center: { lat: 33.938469117159684, lng: -118.2679399959647 },
              zoom: 9,
              markers: [
                {
                  position: { lat: 34.0047158996568, lng: -118.41651441472911 },
                  name: "Culver Palms Animal Hospital",
                  website: "https://culverpalmsanimalhospital.com/",
                },
              ],
            },
            // {
            //   type: "map",
            //   center: { lat: 33.938469117159684, lng: -118.2679399959647 },
            //   zoom: 9,
            //   markers: [
            //     {
            //       position: { lat: 34.0047158996568, lng: -118.41651441472911 },
            //       name: "Culver Palms Animal Hospital",
            //       website: "https://culverpalmsanimalhospital.com/",
            //     },
            //     {
            //       position: {
            //         lat: 33.96333911352371,
            //         lng: -118.42021727331638,
            //       },
            //       name: "Marina Veterinary Center",
            //       website: "https://www.marinavet.com/",
            //     },

            //     {
            //       position: {
            //         lat: 34.078809436743406,
            //         lng: -118.2179621116925,
            //       },
            //       name: "LA Central Animal Hospital",
            //       website: "https://lacentralanimalhospital.com/",
            //     },

            //     {
            //       position: {
            //         lat: 33.95556427616801,
            //         lng: -118.39659333243026,
            //       },
            //       name: "Westchester Veterinary Center and Cat Clinic",
            //       website: "http://www.westchestervet.com",
            //       status: "pendings",
            //     },

            //     {
            //       position: { lat: 34.0191, lng: -118.4937 },
            //       name: "Banfield Pet Hospital",
            //       website: "https://www.banfield.com",
            //     },
            //     {
            //       position: { lat: 34.0023209494312, lng: -118.40581963058001 },
            //       name: "Brent-Air Animal Hospital",
            //       website: "https://brentairanimalhospital.com/",
            //       note: "curside service only",
            //     },

            //     {
            //       position: {
            //         lat: 34.035602154921776,
            //         lng: -118.44509587290779,
            //       },
            //       name: "Emerald Animal Hospital",
            //       email: "info@emeraldanimal.com",
            //       website: "https://emeraldanimal.com/",
            //       note: "general care and has sent email",
            //     },

            //     {
            //       position: {
            //         lat: 34.09163764875563,
            //         lng: -118.33075520174093,
            //       },
            //       name: "The Veterinary Care Center",
            //       website: "https://veterinarycarecenter.com/",
            //       note: "sent the invitation email",
            //     },
            //     {
            //       position: {
            //         lat: 33.97935402449685,
            //         lng: -118.43628711342294,
            //       },
            //       name: "Shane Veterinary Medical Center",
            //       website: "https://www.shanevet.com/site/home",
            //     },
            //     {
            //       position: {
            //         lat: 34.00520332658537,
            //         lng: -118.42997269603164,
            //       },

            //       name: "VCA Animal Hospitals Urgent Care - Mar Vista",
            //       website:
            //         "https://vcahospitals.com/urgent-care-marvista?utm_source=maps&utm_medium=organic&utm_campaign=VCA_Animal_Hospitals_Urgent_Care_Mar_Vista",
            //     },
            //     {
            //       position: {
            //         lat: 34.0046488706125,
            //         lng: -118.40954258107686,
            //       },

            //       name: "Sepulveda Animal Hospital",
            //       website:
            //         "https://vcahospitals.com/urgent-care-marvista?utm_source=maps&utm_medium=organic&utm_campaign=VCA_Animal_Hospitals_Urgent_Care_Mar_Vista",
            //     },
            //     // {
            //     //   position: {
            //     //     lat: 33.987750515597284,
            //     //     lng: -118.4446426666371,
            //     //   },
            //     //   name: "Animal Wellness Centers",
            //     //   website: "https://www.animalwellnesscenters.com/",
            //     // },
            //     {
            //       name: "Center Sinai Animal Hospital",
            //       position: {
            //         lat: 34.01833118738013,
            //         lng: -118.40813929680246,
            //       },
            //       website: "https://centersinaianimalhospital.com/",
            //     }, // 34.04786164165459, -118.21992410000105
            //     {
            //       name: "Los Angeles Veterinary Center (Boyle Heights)",
            //       position: {
            //         lat: 34.047843862460994,
            //         lng: -118.2198919135183,
            //       },
            //       website: "https://laveterinarycenter.com/",
            //     },
            //     {
            //       name: "Valley View Animal Hospital",
            //       position: {
            //         lat: 33.84752791176592,
            //         lng: -118.02939471435792,
            //       },
            //       website: "https://valleyviewah.com/",
            //     },
            //     {
            //       name: "Belmont Shore Veterinary Hospital",
            //       position: {
            //         lat: 33.76642657504627,
            //         lng: -118.11757368650653,
            //       },
            //       website: "https://www.belmontshorevet.com/",
            //     },
            //     // reception@nmah.vet
            //     {
            //       name: "Newport Mesa Animal Hospital",
            //       position: {
            //         lat: 33.631458508390274,
            //         lng: -117.9236859136573,
            //       },
            //       website: "https://nmah.vet/",
            //       email: "reception@nmah.vet",
            //     },
            //     {
            //       name: "Animal Clinic of Tustin Ranch Irvine",
            //       position: {
            //         lat: 33.73099233577863,
            //         lng: -117.78865419406277,
            //       },
            //       website: "https://www.actri.net/",
            //       email: "actristaff@actri.net",
            //     },
            //   ],
            // },
          ],
        },
        {
          id: "whatIsReferralClinic",
          title: "What Is a Referral Clinic?",
          blocks: [
            {
              type: "paragraph",
              text: "A Referral Clinic is a local in-person clinic that can receive patients after a virtual consultation through the Vetcation platform. When a virtual veterinarian determines that a patient requires hands-on care, our system shows a list of nearby clinics based on the pet owner's location. If your clinic is selected, you will receive a secure email with the visit summary and medical record to guide your team’s follow-up care.",
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8973.webp?alt=media&token=2362f8ae-6eb1-40f9-83a7-b2e95cbabd8d",
              ],
            },

            {
              type: "paragraph",
              text: "The image above shows how clinics are displayed to veterinarians when choosing a referral location:",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Black:",
                  lines: [
                    "Clinics that have joined the referral network and are eligible to receive referrals.",
                  ],
                },
                {
                  heading: "Grey:",
                  lines: [
                    "Clinics that have not yet joined and are not selectable by the vet.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "referralBenefits",
          title: "Why Join as a Referral Clinic?",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Receive local patient referrals:",
                  lines: [
                    "Your clinic becomes visible to telemedicine veterinarians when a nearby patient requires in-person diagnostics or treatment. No extra promotion or listing fees are required.",
                  ],
                },
                {
                  heading: "Provide in-person care with full context:",
                  lines: [
                    "You’ll receive the virtual visit summary and relevant records so your team can confidently continue the patient’s care with clear background information.",
                  ],
                },
                {
                  heading: "Open the door to new professional relationships:",
                  lines: [
                    "Referral interactions often lead to ongoing partnerships with virtual veterinarians looking for trusted in-person support.",
                  ],
                },
                {
                  heading: "No fees, no system integration required:",
                  lines: [
                    "Joining is simple. Just confirm by email and your clinic will be eligible to receive referrals when applicable. There’s no obligation, and you can opt out at any time.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "howToJoin",
          title: "How to Join?",
          blocks: [
            {
              type: "qa",
              question: "How do I join as a Referral Clinic?",
              answer: `It’s simple. If you received an email invitation from Vetcation, just reply with your preferred email address for receiving referral records. If you haven’t received an invitation but would like to participate, contact us at <span class="highlight">gcfchen@vetcation.com</span>. There are no fees, no tech setup, and no obligation. You’re simply agreeing to be available as an in-person option for local pet owners when needed.`,
            },
          ],
        },
      ],
    },
    TelemedicineClinics: {
      mainTitle: "Telemedicine-Enabled Clinics on Vetcation",
      mainDescription: `These clinics offer virtual care through Vetcation and can seamlessly transition cases to in-person visits when needed. Pet owners book a virtual appointment under your hospital’s brand; your team receives the consult summary and relevant records, and you maintain ownership of the client relationship and medical record.`,
      sections: [
        {
          id: "networkOverview",
          title: "Vetcation Telemedicine Clinic Network",
          blocks: [
            {
              type: "paragraph",
              text: "Our network highlights clinics that provide telemedicine directly through Vetcation. Clinics can add capacity, protect staff time, and serve nearby pet owners with same-day virtual appointments that escalate to on-site care when appropriate.",
            },
            {
              type: "map",
              center: { lat: 33.938469117159684, lng: -118.2679399959647 },
              zoom: 9,
              markers: [
                {
                  position: { lat: 34.0047158996568, lng: -118.41651441472911 },
                  name: "Culver Palms Animal Hospital",
                  website: "https://culverpalmsanimalhospital.com/",
                },
                {
                  position: {
                    lat: 33.96333911352371,
                    lng: -118.42021727331638,
                  },
                  name: "Marina Veterinary Center",
                  website: "https://www.marinavet.com/",
                },
                {
                  position: {
                    lat: 34.078809436743406,
                    lng: -118.2179621116925,
                  },
                  name: "LA Central Animal Hospital",
                  website: "https://lacentralanimalhospital.com/",
                },
                {
                  position: {
                    lat: 33.95556427616801,
                    lng: -118.39659333243026,
                  },
                  name: "Westchester Veterinary Center and Cat Clinic",
                  website: "http://www.westchestervet.com",
                  status: "pending",
                },
                {
                  position: { lat: 34.0191, lng: -118.4937 },
                  name: "Banfield Pet Hospital",
                  website: "https://www.banfield.com",
                },
                {
                  position: { lat: 34.0023209494312, lng: -118.40581963058001 },
                  name: "Brent-Air Animal Hospital",
                  website: "https://brentairanimalhospital.com/",
                  note: "curbside service only",
                },
                {
                  position: {
                    lat: 34.035602154921776,
                    lng: -118.44509587290779,
                  },
                  name: "Emerald Animal Hospital",
                  email: "info@emeraldanimal.com",
                  website: "https://emeraldanimal.com/",
                  note: "general care; email sent",
                },
                {
                  position: {
                    lat: 34.09163764875563,
                    lng: -118.33075520174093,
                  },
                  name: "The Veterinary Care Center",
                  website: "https://veterinarycarecenter.com/",
                  note: "invitation sent",
                },
                {
                  position: {
                    lat: 33.97935402449685,
                    lng: -118.43628711342294,
                  },
                  name: "Shane Veterinary Medical Center",
                  website: "https://www.shanevet.com/site/home",
                },
                {
                  position: {
                    lat: 34.00520332658537,
                    lng: -118.42997269603164,
                  },
                  name: "VCA Animal Hospitals Urgent Care - Mar Vista",
                  website:
                    "https://vcahospitals.com/urgent-care-marvista?utm_source=maps&utm_medium=organic&utm_campaign=VCA_Animal_Hospitals_Urgent_Care_Mar_Vista",
                },
                {
                  position: { lat: 34.0046488706125, lng: -118.40954258107686 },
                  name: "Sepulveda Animal Hospital",
                  website:
                    "https://vcahospitals.com/urgent-care-marvista?utm_source=maps&utm_medium=organic&utm_campaign=VCA_Animal_Hospitals_Urgent_Care_Mar_Vista",
                },
                {
                  name: "Center Sinai Animal Hospital",
                  position: {
                    lat: 34.01833118738013,
                    lng: -118.40813929680246,
                  },
                  website: "https://centersinaianimalhospital.com/",
                },
                {
                  name: "Los Angeles Veterinary Center (Boyle Heights)",
                  position: {
                    lat: 34.047843862460994,
                    lng: -118.2198919135183,
                  },
                  website: "https://laveterinarycenter.com/",
                },
                {
                  name: "Valley View Animal Hospital",
                  position: {
                    lat: 33.84752791176592,
                    lng: -118.02939471435792,
                  },
                  website: "https://valleyviewah.com/",
                },
                {
                  name: "Belmont Shore Veterinary Hospital",
                  position: {
                    lat: 33.76642657504627,
                    lng: -118.11757368650653,
                  },
                  website: "https://www.belmontshorevet.com/",
                },
                {
                  name: "Newport Mesa Animal Hospital",
                  position: {
                    lat: 33.631458508390274,
                    lng: -117.9236859136573,
                  },
                  website: "https://nmah.vet/",
                  email: "reception@nmah.vet",
                },
                {
                  name: "Animal Clinic of Tustin Ranch Irvine",
                  position: {
                    lat: 33.73099233577863,
                    lng: -117.78865419406277,
                  },
                  website: "https://www.actri.net/",
                  email: "actristaff@actri.net",
                },
              ],
            },
          ],
        },
        {
          id: "whatIsTelemedClinic",
          title: "What Is a Telemedicine-Enabled Clinic?",
          blocks: [
            {
              type: "paragraph",
              text: "A telemedicine-enabled clinic provides virtual appointments under its own brand using Vetcation. When a case requires hands-on care, your team schedules and completes the in-person visit using your standard workflows, ensuring continuity for the client and patient.",
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_8973.webp?alt=media&token=2362f8ae-6eb1-40f9-83a7-b2e95cbabd8d",
              ],
            },
            {
              type: "paragraph",
              text: "How clinics appear to veterinarians when selecting a telemedicine clinic:",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Black:",
                  lines: [
                    "Clinics offering telemedicine through Vetcation (selectable).",
                  ],
                },
                {
                  heading: "Grey:",
                  lines: ["Clinics not yet onboarded (not selectable)."],
                },
              ],
            },
          ],
        },
        {
          id: "clinicBenefits",
          title: "Why Offer Telemedicine with Vetcation?",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Serve nearby pet owners instantly:",
                  lines: [
                    "Be discoverable for same-day virtual care; escalate to on-site visits when needed.",
                  ],
                },
                {
                  heading: "Arrive prepared for in-person care:",
                  lines: [
                    "Your team receives the virtual consult summary and relevant records for smooth follow-up.",
                  ],
                },
                {
                  heading: "Build lasting client relationships:",
                  lines: [
                    "Keep ownership of the client relationship and medical record across virtual and on-site care.",
                  ],
                },
                {
                  heading: "Simple to start:",
                  lines: [
                    "No new software integrations required to be listed. Opt in or out any time.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "howToList",
          title: "How Do We Get Listed?",
          blocks: [
            {
              type: "qa",
              question:
                "How can our clinic appear on this map as telemedicine-enabled?",
              answer: `Reply to your Vetcation invitation email with the preferred address for receiving consult summaries, or contact <span class="highlight">gcfchen@vetcation.com</span>. Once verified, your clinic will appear as selectable for telemedicine on the map. There are no listing fees or obligations.`,
            },
          ],
        },
      ],
    },
    PartneringClinic: {
      mainTitle: "Telemedicine Platform for Partnering Clinics",
      mainDescription: `Vetcation is a flexible, open, and legally compliant telemedicine platform that helps every clinic in California expand into telemedicine, extend veterinary capacity beyond in‑house staff, and reach more clients. With our partnership agreement feature, California‑licensed veterinarians can request to collaborate with your clinic, providing virtual care under your clinic’s name while sharing both revenue and medical records to ensure continuity of care.`,
      sections: [
        /* 1. Business impact for clinics */
        {
          id: "clinicBenefits",
          title: "What Can Your Clinic Achieve with Vetcation?",
          blocks: [
            {
              type: "paragraph",
              text: "Scale services, protect your brand, and improve patient outcomes without extra payroll or infrastructure:",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Expand veterinary capacity without hiring:",
                  lines: [
                    "Partner with licensed vets who work remotely under your clinic’s name during evenings, weekends, or peak periods.",
                  ],
                },
                {
                  heading: "Retain full ownership of brand and records:",
                  lines: [
                    "All medical records and client relationships stay with your clinic — stored securely and AB 1399‑compliant.",
                  ],
                },
                {
                  heading: "Add revenue with zero upfront cost:",
                  lines: [
                    `Virtual visits generate new income streams for your clinic. For each full-time virtual vet you partner with, your clinic can earn up to <span class="highlight">$75,000+ per year</span> without hiring new staff or adding overhead.`,
                  ],
                },
                {
                  heading: "Seamless continuity of care:",
                  lines: [
                    "Telemedicine notes flow straight into your workflow, so in‑person follow‑ups are informed and efficient.",
                  ],
                },
                {
                  heading: "Built‑in legal safeguards:",
                  lines: [
                    "Vetcation’s workflows align with California’s telehealth rules — reducing audit risk and paperwork.",
                  ],
                },
              ],
            },
          ],
        },

        /* 2. Differentiators */
        {
          id: "whyChooseVetcationClinic",
          title: "Why Choose Vetcation?",
          blocks: [
            {
              type: "paragraph",
              text: "Designed specifically for brick‑and‑mortar clinics — not a competing marketplace:",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "One‑click vet onboarding & scheduling control:",
                  lines: [
                    "Approve or deny partnership requests, set hours, and cap daily telemedicine slots in seconds.",
                  ],
                },
                {
                  heading: "Shared medical records, no data silos:",
                  lines: [
                    "Every virtual visit automatically syncs with your clinic’s record — ready for follow‑up, lab work, or radiology.",
                  ],
                },
                {
                  heading: "Higher client retention & satisfaction:",
                  lines: [
                    "Offer after‑hours triage and convenient rechecks that keep pet owners loyal to your clinic.",
                  ],
                },
                {
                  heading: "Dedicated regulatory & tech support:",
                  lines: [
                    "Questions on AB 1399 audits or EMR integration? Our in‑house team is on call.",
                    "📧 gcfchen@vetcation.com",
                    "📞 (530) 400‑6227",
                  ],
                },
              ],
            },
          ],
        },

        /* 3. Market data & trend points for clinics */
        {
          id: "whyVirtualCareTrendClinic",
          title: "Why Clinics Are Embracing Telemedicine",
          blocks: [
            {
              type: "trendPoints",
              introParagraphs: [
                "VVCA’s 2024 State of Virtual Care Report highlights urgent shortages and soaring demand — telemedicine is now a strategic necessity:",
              ],
              items: [
                {
                  heading: "Severe workforce gaps:",
                  lines: [
                    "The U.S. needs **12,000 more veterinarians** and **48,000 support staff** to meet baseline demand; **22% of counties have zero veterinary employees**.",
                  ],
                },
                {
                  heading: "Demand from underserved pet owners:",
                  lines: [
                    "**25 million companion animals** live in counties with the lowest access scores. Virtual care lets your clinic reach them without opening a new location.",
                  ],
                },
                {
                  heading: "High‑satisfaction service channel:",
                  lines: [
                    "Virtual consults achieve a **98.4% consumer satisfaction rate** across the U.S., U.K., and Canada — higher than many in‑person benchmarks.",
                  ],
                },
                {
                  heading: "Efficiency & revenue benefits:",
                  lines: [
                    "**58%** of treatment‑oriented virtual cases are resolved remotely, freeing onsite appointments for higher‑value procedures and reducing no‑shows.",
                  ],
                },
                {
                  heading: "Competitive differentiation:",
                  lines: [
                    "Early‑adopter clinics position themselves as modern, convenient, and tech‑forward — key factors in attracting both clients and new hires.",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    //     Bill1399: {
    //       mainTitle: "Assembly Bill 1399",
    //       mainDescription: `Assembly Bill (AB) 1399 (Friedman, Chapter 475, Statutes of 2023) took effect
    //     on January 1, 2024. This legislation sets out clear requirements for establishing a
    //     valid veterinarian-client-patient relationship (VCPR) before prescribing, dispensing,
    //     or administering any treatment for animal care. (Business and Professions Code (BPC),
    //     § 4826.6.) AB 1399 also clarifies how veterinary telehealth may be provided under
    //     California law. (BPC, §§ 4825.1, 4826.6, 4829.5, and 4853.)

    //     Below are frequently asked questions (FAQs) the Veterinary Medical Board (Board) has
    //     compiled in response to public inquiries about the new law. We’ve included notes on
    //     how Vetcation’s features help veterinary professionals comply with each requirement
    //     through our built-in workflows and technology tools. In the event of any differences
    //     between these FAQs and the statute itself, the statute is controlling, and the Board
    //     will enforce it accordingly. Veterinary professionals should review the official
    //     statutes in detail to ensure full compliance.`,
    //       sections: [
    //         {
    //           id: "telehealthStandardOfCare",
    //           title: "Telemedicine Holds the Same Standard of Care",
    //           blocks: [
    //             {
    //               type: "paragraph",
    //               text: "Telemedicine must meet the same standard of care as in-person veterinary services. Under AB 1399, before delivering veterinary medicine via telehealth, the veterinarian shall inform the client about the use and potential limitations of telehealth and obtain their consent. (Business and Professions Code (BPC), § 4826.6, subd. (g).)",
    //             },
    //             {
    //               type: "bulletList",
    //               items: [
    //                 {
    //                   heading: "Same standards of care apply:",
    //                   lines: [
    //                     "The same standards of care apply to veterinary medicine services via telehealth and in-person veterinary medical services.",
    //                   ],
    //                 },
    //                 {
    //                   heading: "In-person visit option:",
    //                   lines: [
    //                     "The client has the option to choose an in-person visit from a veterinarian at any time.",
    //                   ],
    //                 },
    //                 {
    //                   heading: "Follow-up and tech-failure guidance:",
    //                   lines: [
    //                     "The client has been advised how to receive follow-up care or assistance in the event of an adverse reaction to the treatment or in the event of an inability to communicate resulting from technological or equipment failure.",
    //                     "Vetcation provides Vetssenger (inquiry-based messaging tool; see vetssenger section in user manual) to facilitate timely follow-up communication and support, helping you comply with AB 1399 and deliver the same standard of care as in-person visits.",
    //                   ],
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqOutOfState",
    //           title: "Out-of-state Telemedicine",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a California licensed veterinarian use telemedicine to establish or continue treatment within an existing VCPR if the animal patient is originally from California but is currently located outside of California?",
    //               answer:
    //                 "No. Under AB 1399, for a California-licensed veterinarian to provide veterinary medical services via telehealth, the animal must be physically located in California. (BPC, § 4826.6, subd. (f).) However, authorizing a refill for an existing prescription (for an out-of-state pet) is not considered telehealth.",
    //               example:
    //                 "If your long-time client and their pet travel to Oregon, you cannot initiate a new telemedicine consult while the pet is out of state. However, if the pet already has an active prescription on file, you can authorize a refill without it being classified as a “telehealth” service.",
    //               helpText:
    //                 "Our platform automatically checks the patient's reported location at the time of scheduling. If an out-of-state location is detected, Vetcation will block the client from booking a new telemedicine appointment to ensure compliance with state regulations. However, if there is an existing prescription on file, you may still authorize refills without it being classified as a telehealth service.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqRefillOutOfStatePharmacy",
    //           title: "Refilling Prescriptions at Out-of-State Pharmacies",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a California-licensed veterinarian authorize a prescription refill to an out-of-state pharmacy if the animal patient is currently located outside of California?",
    //               answer:
    //                 "Yes. Under AB 1399, while a California-licensed veterinarian cannot initiate a new telemedicine consult for an animal patient located outside of California, they may authorize a refill for an existing prescription. This authorization can be directed to a pharmacy in the state where the animal is currently located. (BPC, § 4826.6, subd. (f).)",
    //               example:
    //                 "If your client and their pet are traveling in Oregon and require a refill of an existing prescription, you can authorize the refill and direct it to a local pharmacy in Oregon. This action is permissible and does not constitute telehealth under California law.",
    //               helpText:
    //                 "Vetcation facilitates the authorization of prescription refills to out-of-state pharmacies for existing prescriptions. Our platform ensures that such actions comply with AB 1399 by verifying the existence of a valid VCPR and restricting new telemedicine consults when the animal patient is out of state.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqSameDiagnosisNewMed",
    //           title:
    //             "New Medications for the Same Diagnosis While Pet Is Out of State",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a California-licensed veterinarian prescribe a new medication for the same diagnosis if the animal is currently out of state?",
    //               answer:
    //                 "No. Under AB 1399, prescribing any new medication while the animal is physically outside of California is considered telehealth and is not permitted — even if the diagnosis (such as gastroenteritis) was previously established. The only exception is authorizing a refill of an existing prescription. Initiating a new treatment plan, even under the same diagnosis, is not allowed if the animal is not in California.",
    //               example:
    //                 "If a dog was diagnosed with gastroenteritis during an in-state visit and was prescribed anti-nausea medication for vomiting, but later develops diarrhea while in another state, the vet cannot prescribe a new anti-diarrheal unless it was already included as a PRN medication during the original consult.",
    //               helpText:
    //                 "Vetcation supports responsible use of PRN medications during the original in-state consult by allowing vets to proactively prescribe treatments for anticipated symptoms under a single diagnosis. However, if the pet is out of state and needs a new medication not already covered in the original care plan, our platform restricts new prescriptions to ensure compliance with AB 1399.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqConfirmLocation",
    //           title: "Confirming Location",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Does the client providing a California address suffice to satisfy the requirement that the animal patient is located in this state?",
    //               answer:
    //                 "No. It is recommended the veterinarian confirm with the client that the animal patient is physically in California at the time telehealth services are provided. (BPC, § 4826.6, subd. (f).)",
    //               example:
    //                 "A client might list a California home address but could be traveling with their pet in Nevada. In this scenario, you cannot initiate a new telemedicine consult under California law because the pet is physically out of state.",
    //               helpText:
    //                 "Our platform prompts the client to confirm their current location at the start of each telehealth appointment. If the address is outside California, Vetcation alerts you that proceeding with a new telemedicine consult may not be permissible. This ensures you remain compliant with AB 1399 while still allowing you to manage refills or follow-up actions for existing prescriptions.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqVetOutOfState",
    //           title: "Veterinarian Location",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a California-licensed veterinarian provide telemedicine if they are physically located outside of California?",
    //               answer:
    //                 "Yes. Under AB 1399, veterinary telehealth is legally considered to occur at the location of the animal patient — not the veterinarian. As long as the animal is physically in California at the time of the telemedicine consult, a California-licensed veterinarian may practice via telehealth even if they are located outside of California or outside the United States.",
    //               example:
    //                 "If you are a California-licensed veterinarian traveling in New York or abroad and a pet located in California needs a telemedicine consult, you may provide care as long as a valid VCPR is established and all requirements of AB 1399 are followed.",
    //               helpText:
    //                 "Vetcation allows licensed California veterinarians to log in and offer virtual care from anywhere. Our system ensures telehealth consults can only be initiated when the animal is reported to be in California, helping you stay compliant with the law while maintaining flexibility in how and where you practice.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqPrescriptionNotice",
    //           title: "Posting Prescription Availability",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can the veterinarian notify the client that “some prescription drugs or medications may be available at a pharmacy” by posting a notice in a virtual lobby?",
    //               answer:
    //                 "Yes. The requirement is to provide notice to the client that some prescription drugs or medications may be available at a pharmacy, but there is no specific method prescribed for doing so. (BPC, § 4826.6, subd. (i)(7).) However, the prescribing veterinarian must still comply with all statutes and regulations in the Veterinary Medicine Practice Act and Pharmacy Law. This includes, but is not limited to, prescriber dispensing requirements listed in BPC section 4170.",
    //               example:
    //                 'You could display a banner in your virtual meeting room that reads: "Certain medications may be available at a pharmacy." As long as clients see this notice before or during the telehealth visit, you have met the requirement.',
    //               helpText:
    //                 "Our platform will show the banner on the appointment card, automatically displaying it to all clients prior to the consultation. This ensures compliance with AB 1399 and helps track user acknowledgment of the notice in your records.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqOnePosting",
    //           title: "Combining Disclosures",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "If the prescription notice can be posted in the lobby, can it be incorporated into the existing notice requirement so that both disclosures are in one posting?",
    //               answer:
    //                 "Yes. Both disclosures can be combined into a single posting, since the law does not require them to be displayed separately. Consolidating them ensures clients see all relevant information in one place, reducing confusion and improving compliance.",
    //               example: "",
    //               helpText:
    //                 'Our platform has helped you create a combined notice that includes important telemedicine disclaimers, such as pharmacy availability, professional standards (telemedicine follows the same regulations as in-person care), and emergency guidance (e.g., "Emergencies cannot be treated via telehealth"). All of these appear on the appointment card so clients see them before the telemedicine session begins. Vetcation also tracks user acknowledgment, giving you a record that they’ve viewed the notice.',
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqPharmacyChoice",
    //           title: "Pharmacy Choice Disclosure",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Since AB 1399 only requires veterinarians to notify the client that “some prescription drugs or medications may be available at a pharmacy,” does the veterinarian have to notify the client that the veterinarian can submit a prescription to the pharmacy of the client’s choice?",
    //               answer:
    //                 "Yes. The veterinarian must provide the client with a written disclosure that the client may obtain the prescription either from the veterinarian or from a pharmacy of the client’s choice. (BPC, § 4170, subd. (a)(7).) Furthermore, before prescribing, the veterinarian must offer to provide a written prescription that the client may choose to have filled by the prescriber or by any pharmacy. (BPC, § 4170, subd. (a)(6).)",
    //               example: "",
    //               helpText:
    //                 "Our platform allows clients to select their preferred pharmacy — whether a physical location like Costco, Walmart, or CVS, or an online pharmacy such as Mixlab or Chewy. Vets can confirm the client’s choice directly in the Vetcation interface before finalizing a prescription, ensuring compliance with AB 1399 and other state regulations.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqPrivacyLaws",
    //           title: "Privacy and Confidentiality",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What are the privacy protection laws with which a veterinarian practicing veterinary medicine via telehealth must comply?",
    //               answer:
    //                 "Under California law (BPC section 4857), veterinarians must maintain the confidentiality of all client and patient information, just as they would for in-person care. If a veterinarian negligently releases this information, they could face a civil lawsuit (outside of the Veterinary Medical Board’s jurisdiction). In other words, even though the Board may not prosecute you for a privacy breach, a client could sue you in civil court for mishandling confidential data. That’s why it’s crucial to understand and follow privacy laws that apply to veterinary practice, both in person and via telehealth.",
    //               example: "",
    //               helpText:
    //                 "Our platform is designed with secure data handling and encrypted communication to protect confidential information during telehealth sessions. Vetcation also provides access controls so that only authorized users can view client records, reducing the risk of accidental disclosure. We recommend veterinarians familiarize themselves with all relevant privacy regulations and use best practices — such as password protection, secure networks, and careful record-sharing protocols—to minimize liability.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqMedicalHistory",
    //           title: "Obtaining Relevant Medical History",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "If the client does not provide the veterinarian with the animal patient’s relevant medical history or medical records, can the veterinarian provide veterinary telehealth for the animal patient?",
    //               answer:
    //                 "Telehealth cannot be used if the veterinarian does not obtain and review the relevant medical history for the animal. However, actual medical records are not strictly required — if the client can relay the pet’s relevant history verbally or via written form, that may suffice. If official medical records are available, the veterinarian must obtain and review them before proceeding. (BPC, § 4826.6, subd. (h)(2).)",
    //               example: "",
    //               helpText:
    //                 "Our platform prompts the client to provide a thorough history of the animal’s condition before the telehealth appointment. If past records exist, we encourage clients to upload them. This ensures the veterinarian has enough background information to make an informed assessment, keeping the telehealth process compliant with AB 1399 and other state regulations.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqLocalResources",
    //           title: "Local Medical Resources Familiarity",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "How will the Board verify that the veterinarian providing telehealth was familiar with available medical resources, including emergency resources, near the animal patient’s location?",
    //               answer:
    //                 "If the Board inquires whether you were familiar with the medical resources available near the patient’s location (including emergency care), you must be able to explain your familiarity and, if necessary, submit documentation that supports your claim. (BPC, § 4826.6, subd. (h)(4).) This might involve showing references or notes about nearby emergency clinics, urgent care facilities, or specialized hospitals within the pet’s region.",
    //               example: "",
    //               helpText:
    //                 "Our platform automatically provides veterinarians with local emergency contact information based on the client’s reported location. This includes the name, address, and phone number of nearby clinics or hospitals. You can still choose to add notes or reference other resources, but the system helps ensure you are equipped with key information. If the Board requests validation, you’ll have easy access to records demonstrating your familiarity with local medical resources, supporting compliance with AB 1399.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqMidwayInterruption",
    //           title: "Mid-Appointment Interruption",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "If midway through an appointment the synchronous audio-visual communication is interrupted, can a VCPR be established solely by another form of electronic communication?",
    //               answer:
    //                 "No. To establish a valid VCPR via telehealth, the veterinarian must gain sufficient knowledge of the animal patient by examining the patient using synchronous audio-video communication. (BPC, § 4826.6, subd. (b)(2).) Once a VCPR is established, ongoing care may continue via other telehealth methods, unless the veterinarian determines that synchronous audio-video is necessary for proper treatment. (BPC, § 4826.6, subd. (d).)",
    //               example: "",
    //               helpText:
    //                 "Our platform prioritizes a stable audio-video connection, allowing vets to meet the synchronous requirement. If a technical interruption occurs, Vetcation enables quick reconnection or rescheduling so that you can complete the real-time exam.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqAntimicrobialDefinition",
    //           title: "Definition of 'Antimicrobial'",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Which definition of “antimicrobial” will the Board use to enforce the antimicrobial prescription by telehealth provision?",
    //               answer:
    //                 "The Board will follow the definition provided in Appendix A of the federal Food and Drug Administration’s Guidance for Industry #152. This includes “critically important,” “highly important,” and “important” antimicrobial drugs, as Appendix A may be amended over time.",
    //               example: "",
    //               helpText:
    //                 "Our platform flags prescriptions that fall under these categories, ensuring veterinarians recognize when an antimicrobial is being prescribed. We also offer quick reference links to the FDA’s updated lists, so you can confirm a drug’s classification before finalizing a telehealth prescription.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqRacehorsePrescribing",
    //           title: "Prescribing for Racehorses via Telehealth",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "If a veterinarian prescribes medication via telehealth unknowingly to a racehorse or to a trainer registered with the California Horse Racing Board (CHRB), what documentation would the Board require to show that the vet was unaware of these circumstances?",
    //               answer:
    //                 "Before prescribing any drug or medication via telehealth, the veterinarian must confirm with the client that the horse is not engaged in racing or training at a facility under CHRB jurisdiction. If the horse is engaged in racing or training under the CHRB, telehealth prescribing is prohibited. (BPC, § 4826.6, subd. (i)(8).) The veterinarian’s lack of knowledge is not considered a defense if the horse is later found to be racing or training. Therefore, you should document your inquiry and the client’s response in the medical record to demonstrate due diligence in verifying the horse’s status.",
    //               example: "",
    //               helpText:
    //                 "Our platform includes a pre-consultation form where clients must disclose whether the horse is involved in racing or training under the CHRB. Vetcation automatically stores this information in the patient’s record, providing written proof that the veterinarian asked — and the client answered — before issuing any telehealth prescriptions.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqChangeDosage",
    //           title: "Changing Dosage for Racehorses via Telehealth",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a veterinarian via telehealth change the dosage of a previously prescribed drug or medication for a horse engaged in racing or training at a facility under the jurisdiction of the California Horse Racing Board (CHRB)?",
    //               answer:
    //                 "No. Any change to a previously prescribed drug or medication is treated as a new prescription and cannot be issued via telehealth for a horse engaged in racing or training under CHRB jurisdiction. (BPC, § 4826.6, subd. (i)(8).)",
    //               example: "",
    //               helpText:
    //                 "Vetcation automatically prompts veterinarians to confirm the horse’s racing status before modifying any prescription. If the horse is under CHRB jurisdiction, the system will flag the dosage change as prohibited for telehealth, helping you avoid regulatory violations.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqRemoteExamAssistant",
    //           title: "Remote Examination with a Veterinary Assistant",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "If a veterinary assistant and client are in a room located within a registered veterinary premises, can a veterinarian remotely perform an examination and ask the veterinary assistant to perform diagnostic tests as needed?",
    //               answer:
    //                 "Yes. If the veterinarian determines that a VCPR can be established via telehealth, a veterinary assistant may carry out certain diagnostic tests under the veterinarian’s indirect supervision. However, the assistant cannot obtain or administer anesthesia or controlled substances for these tests. (BPC, § 4836.1.) Additionally, any use of radiographic equipment must be performed by an individual trained in radiation safety and techniques, under the direct supervision of a registered veterinary technician (RVT) or licensed veterinarian. (BPC, § 4840.7, subd. (b).)",
    //               example: "",
    //               helpText:
    //                 "Our platform supports real-time video oversight, enabling the veterinarian to guide the assistant’s tasks remotely. Vetcation also logs each procedure, ensuring compliance with supervision requirements. If radiographs or other specialized diagnostics are needed, the system can prompt for an RVT or licensed vet to be present, helping you maintain compliance with California law.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqAssistantVaccinations",
    //           title: "Vaccinations by Veterinary Assistant via Telemedicine",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a veterinary assistant give vaccinations under the direct supervision of the remote veterinarian performing the telemedicine examination?",
    //               answer:
    //                 "Under California law, a veterinary assistant may administer a prescribed vaccine at a registered veterinary premises if and only if the vaccine is not a controlled substance or otherwise “restricted” (BPC § 4836.1(a)). In that scenario, the assistant may work either under the indirect supervision of a veterinarian who ordered the vaccine—even if that vet performed the exam via telemedicine—or under the direct supervision of a Registered Veterinary Technician (RVT) physically on-site (BPC, § 4836.1, subds. (a), (b); CCR, tit. 16, §§ 2034, subs. (f), 2036.5, subs. (b).).",
    //               example: "",
    //               helpText:
    //                 "Our platform timestamps and documents every step of a telemedicine visit and enforces that only non-controlled vaccines are used. At the point of administration, it prompts you to confirm “Indirect Vet Supervision,” so the assistant can proceed under the remote veterinarian’s orders, ensuring clear roles and full compliance with California law.",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     VCPR: {
    //       mainTitle: "Veterinarian-Client-Patient Relationship (VCPR)",
    //       mainDescription: `A valid, <span class="highlight">condition-specific</span> VCPR is the cornerstone of providing
    // veterinary care, whether in person or via telehealth. Under California law
    // (BPC § 4826.6) a separate VCPR must be formed for each new clinical
    // condition. A VCPR may be established by:
    // (1) synchronous audio-video examination,
    // (2) in-person examination of the animal, or
    // (3) medically appropriate, timely visits to the <span class="highlight">premises where a herd,
    // flock, or other group of animals is kept</span> (not routine house-calls for
    // individual pets).
    // The FAQs below explain each pathway and how Vetcation helps you remain
    // compliant.`,
    //       sections: [
    //         {
    //           id: "definingVCPR",
    //           title: "Defining VCPR",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What exactly is a Veterinarian-Client-Patient Relationship (VCPR)?",
    //               answer:
    //                 "A VCPR exists when a veterinarian (1) assumes responsibility for medical" +
    //                 " judgments regarding a specific condition of an animal patient, and" +
    //                 " (2) the client agrees to follow the veterinarian’s instructions. The" +
    //                 " veterinarian must be sufficiently familiar with the animal’s present" +
    //                 " condition (via in-person exam, synchronous audio-video exam, or" +
    //                 " timely premises visits) and must communicate a treatment or" +
    //                 " diagnostic plan to the client. Each new condition (e.g., otitis vs." +
    //                 " dermatitis) requires a new VCPR. (BPC § 4826.6(a), (b)).",
    //               example:
    //                 "You perform a live video exam for a dog’s skin infection and advise a" +
    //                 " treatment plan. Two months later the same dog injures its leg; that" +
    //                 " orthopedic issue requires establishing a new VCPR before you may" +
    //                 " diagnose or prescribe for that condition.",
    //               helpText:
    //                 "Vetcation logs every exam (in-person or video) with its associated" +
    //                 " condition, giving you an audit trail that demonstrates compliance" +
    //                 " if questions arise.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqSynchronousAV",
    //           title: "Synchronous Audio-Video Examination",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "How does a synchronous audio-video exam establish a VCPR?",
    //               answer:
    //                 "AB 1399 allows a veterinarian to establish a condition-specific VCPR by" +
    //                 " examining the patient in real time using two-way audio-video." +
    //                 " (BPC § 4826.6(b)(2)).",
    //               example:
    //                 "During a Vetcation video call, you observe a dog’s pruritic skin," +
    //                 " discuss history, and develop a treatment plan—thereby forming a" +
    //                 " VCPR for that dermatologic condition.",
    //               helpText:
    //                 "The platform records the date, duration, and condition so you can" +
    //                 " verify that the exam met the synchronous requirement.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqInPersonExam",
    //           title: "In-Person Examination",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "How does an in-person examination factor into establishing a VCPR?",
    //               answer:
    //                 "An in-person exam remains the traditional pathway. Once you have" +
    //                 " physically examined the animal for a given condition, you may" +
    //                 " deliver follow-up telehealth services for that same condition—up to" +
    //                 " the prescription time limits outlined below. (BPC § 4826.6(b)(1)).",
    //               example:
    //                 "A cat seen in clinic for chronic kidney disease on 1 Jan 2025 may" +
    //                 " receive telehealth management of *that* disease thereafter—subject" +
    //                 " to drug-specific renewal limits.",
    //               helpText:
    //                 "Vetcation links the in-person visit to its condition so later" +
    //                 " telehealth encounters reflect a valid VCPR.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqPremisesVisit",
    //           title: "Premises Visits (Herd / Stable)",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What is a premises visit, and how does it establish a VCPR?",
    //               answer:
    //                 "A premises visit is an on-site evaluation of animals kept as a herd," +
    //                 " flock, or stable group. Home visits for individual companion" +
    //                 " animals do *not* qualify. (BPC § 4826.6(b)(3)).",
    //               example:
    //                 "You inspect a goat herd at a ranch—creating a VCPR for herd health" +
    //                 " conditions you assessed. Future telemedicine consults for that herd" +
    //                 " can rely on the premises-based VCPR, within prescription limits.",
    //               helpText:
    //                 "Each premises visit is time-stamped and condition-tagged in" +
    //                 " Vetcation’s records to demonstrate compliance.",
    //             },
    //           ],
    //         },
    //         // ...Add more FAQs about VCPR as needed...
    //       ],
    //     },

    //     PrescriptionLimits: {
    //       mainTitle: "Prescription Time Limits under AB 1399",
    //       mainDescription: `Once a valid, condition-specific VCPR is established, California law
    // (BPC § 4826.6(i)) imposes <span class="highlight">drug-specific</span> renewal limits. The one-year
    // and six-month clocks apply only to <span class="highlight">the same drug</span> originally
    // prescribed for that condition; switching to a different medication
    // requires clinical reassessment regardless of time elapsed.`,
    //       sections: [
    //         {
    //           id: "faqGeneralOverview",
    //           title: "General Overview",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question: "Why do different prescription time limits apply?",
    //               answer:
    //                 "California distinguishes between VCPRs formed in person versus by" +
    //                 " synchronous video. For a drug first prescribed after an in-person" +
    //                 " exam, you may refill that *same* drug for up to one year. If the" +
    //                 " VCPR was formed solely via video, refills of that same drug are" +
    //                 " limited to six months—or 14 days for antimicrobials.",
    //               example:
    //                 "You examine a dog in clinic on 1 Mar 2025 and start carprofen. Carprofen refills are allowed until 1 Mar 2026. If the same dog’s allergy flare is managed by a video VCPR on 1 Apr 2025 with apoquel, apoquel refills can continue only until 1 Oct 2025 unless you re-examine first.",
    //               helpText:
    //                 "Vetcation tracks the drug name, exam type, and prescription date. If you attempt to refill beyond the one-year, six-month, or 14-day window, the system flags it and prompts a new exam.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqOneYearLimit",
    //           title: "1-Year Limit (After In-Person Exam)",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "How long can I refill a medication after an in-person exam?",
    //               answer:
    //                 "For the *same medication* and condition, up to one year from the exam" +
    //                 " date. New medications or new conditions require a fresh exam." +
    //                 " (BPC § 4826.6(i)(2)).",
    //               example:
    //                 "You examine a cat in person on 1 Jan 2025 and start benazepril." +
    //                 " Benazepril may be refilled until 1 Jan 2026. Initiating amlodipine" +
    //                 " for a new hypertension diagnosis would first require a new exam.",
    //               helpText:
    //                 "Vetcation automatically tracks the date and type of the last in-person exam for each condition. As the one-year mark approaches, the system alerts you and, if you attempt a refill past the deadline, blocks the prescription until a new exam is logged.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqSixMonthLimit",
    //           title: "6-Month Limit (Video-Only VCPR)",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question: "What if the VCPR was formed via synchronous video?",
    //               answer:
    //                 "The *same drug* may be refilled for up to six months from that video" +
    //                 " exam. After six months—or for a different drug—you must re-examine" +
    //                 " the patient. (BPC § 4826.6(i)(4)).",
    //               example:
    //                 "A 1 Feb 2025 video consult leads to gabapentin for chronic pain." +
    //                 " Gabapentin refills are permissible until 1 Aug 2025 provided the" +
    //                 " condition remains stable.",
    //               helpText:
    //                 "Vetcation time-stamps each video exam and tags the prescribed drug. If you try to refill that drug after the six-month window, the platform blocks the order and prompts you to schedule a new exam.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqFourteenDayLimit",
    //           title: "14-Day Limit for Antimicrobials",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Is it true that antibiotics (and other antimicrobials) are limited to 14 days if the VCPR is established via telehealth?",
    //               answer:
    //                 "Yes. If you established the VCPR using synchronous audio-video, you can only prescribe an antimicrobial drug for up to 14 days of treatment. Any refill or extension beyond 14 days requires an in-person exam. (BPC, § 4826.6, subd. (i)(5).)",
    //               example:
    //                 "You diagnose a dog with a skin infection via video consult and prescribe a 10-day course of antibiotics. If the dog needs more than 10 days total, you can extend up to 14 days. But if the condition isn’t resolved by then, you must see the dog in person before prescribing more antibiotics.",
    //               helpText:
    //                 "We tag certain medications as 'antimicrobials' in our drug database. If you attempt to prescribe beyond 14 days of treatment via telehealth-only VCPR, the system will block it and prompt you to schedule an in-person follow-up.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqControlledSubstances",
    //           title: "Controlled Substances, Xylazine, and Racehorses",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Are there additional restrictions on controlled substances, xylazine, or prescriptions for racehorses?",
    //               answer:
    //                 "Yes. If you have not performed an in-person exam, California law prohibits prescribing controlled substances or xylazine via telehealth. Also, you cannot prescribe any drug via telehealth for a horse engaged in racing or training at a CHRB-regulated facility. (BPC, § 4826.6, subds. (i)(6), (i)(8).)",
    //               example:
    //                 "A trainer of a racehorse calls you for a telehealth consult. Because the horse is in training at a CHRB facility, you’re not allowed to prescribe any medication via telehealth. Similarly, if a cat needs a controlled pain medication, you must have performed an in-person exam first.",
    //               helpText:
    //                 "We flag attempts to prescribe controlled substances or xylazine if the patient’s record only shows a telehealth exam. We also prompt the user to confirm if the horse is under CHRB jurisdiction, blocking telehealth prescriptions if it is.",
    //             },
    //           ],
    //         },
    //       ],
    //     },

    //     PrivacyConfidentiality: {
    //       mainTitle: "Privacy & Confidentiality in Telemedicine",
    //       mainDescription: `Under California law, veterinarians must ensure the privacy and confidentiality
    //     of all client and patient information, whether in-person or via telehealth.
    //     Business & Professions Code (BPC) § 4826.6(h)(1) requires secure technology for
    //     telehealth services, while BPC § 4857 addresses the release of confidential records
    //     and potential civil liability for negligence. The FAQs below clarify these obligations
    //     and explain how Vetcation helps you comply.`,
    //       sections: [
    //         {
    //           id: "faqPrivacyOverview",
    //           title: "General Privacy Requirements",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What are the main privacy rules for telemedicine under AB 1399?",
    //               answer:
    //                 "Under BPC § 4826.6(h)(1), veterinarians must use technology and methods that protect confidential client and patient information during telehealth. Additionally, you must follow the same privacy and recordkeeping standards that apply to in-person care. If medical records exist, you must maintain their confidentiality and ensure they’re only accessed by authorized personnel. (BPC § 4857.)",
    //               example:
    //                 "If you store telemedicine session videos or chat logs, you must keep them secure — just like paper records in a physical clinic. This means using encrypted storage, limiting who can view them, and retaining them for the legally required duration.",
    //               helpText:
    //                 "Our platform uses end-to-end encryption for live video sessions and secure data storage for patient records. Only the assigned veterinarian and authorized team members can access these files, reducing the risk of accidental disclosure.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqCivilLiability",
    //           title: "Civil Liability for Negligent Release",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What happens if a veterinarian accidentally discloses confidential information from a telemedicine session?",
    //               answer:
    //                 "BPC § 4857 states that a veterinarian can face civil liability for the negligent release of confidential information, in addition to any potential disciplinary action. This means a client could sue you in civil court for damages if their data was mishandled. The Veterinary Medical Board may not prosecute a privacy breach directly, but a civil suit could still be brought against you if you fail to safeguard client or patient information.",
    //               example:
    //                 "If a veterinarian’s unsecured laptop is stolen, revealing telemedicine session notes or client addresses, the vet could face a lawsuit if it’s proven they did not take reasonable steps to protect that data.",
    //               helpText:
    //                 "We implement role-based access controls, meaning only verified staff can view sensitive records. Vetcation also provides secure sign-in and logs all user activity. This helps you prove you took proper precautions if a dispute arises.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqAIProcessing",
    //           title: "AI-Assisted Medical Records & Appointment Summaries",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "How does using AI to process audio or video from telemedicine sessions affect privacy and confidentiality, especially if the platform also generates an appointment summary for the client?",
    //               answer:
    //                 "Any AI feature that processes telemedicine audio or video must comply with the same confidentiality requirements as traditional recordkeeping. This includes creating both the official medical record (for the veterinarian) and a shareable appointment summary (for the client). You should obtain informed consent from both the client and any participating veterinary staff before capturing or processing any recordings. While California law does not prohibit AI usage, the veterinarian is still responsible for ensuring the data is stored securely, access is restricted to authorized personnel, and no unauthorized disclosures occur. (BPC §§ 4826.6(h)(1), 4857.)",
    //               example:
    //                 "If you plan to record the audio from a live consult and use AI to generate a medical record, you must notify the client that their session is being recorded and processed. If they decline, you cannot record or process their session. Consent is essential, and all data must remain encrypted and access-controlled.",
    //               helpText:
    //                 "Our AI operates on secure, internal servers — no third-party cloud providers. We encrypt audio files and transcripts, then generate two separate documents: (1) a detailed medical record for the veterinarian’s files, and (2) a concise appointment summary for the client’s portal. Before the AI feature is enabled, Vetcation prompts you to confirm that the client has agreed to have their session recorded and processed, preventing any inadvertent privacy violations.",
    //             },
    //           ],
    //         },
    //         // ...Add more FAQs if needed...
    //       ],
    //     },

    //     RacehorseCHRBRestrictions: {
    //       mainTitle: "Racehorse / CHRB Restrictions",
    //       mainDescription: `California law places special restrictions on prescribing
    //     drugs for horses engaged in racing or training at facilities under the jurisdiction
    //     of the California Horse Racing Board (CHRB). (BPC, § 4826.6, subd. (i)(8).) Veterinarians
    //     providing telehealth services must confirm the horse’s status before prescribing
    //     any medication, as ignorance of the horse’s racing or training activities is
    //     not considered a valid defense.`,
    //       sections: [
    //         {
    //           id: "faqCHRBNoTeleRx",
    //           title: "No Telehealth Prescriptions for Racehorses",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a veterinarian prescribe medication via telehealth for a horse engaged in racing or training at a CHRB-regulated facility?",
    //               answer:
    //                 "No. Under AB 1399 (BPC, § 4826.6, subd. (i)(8)), a veterinarian is prohibited from prescribing any drug or medication via telehealth if the horse is actively racing or training at a CHRB facility. This restriction applies even if you have an established VCPR through synchronous audio-video. An in-person examination is required for any prescription in these cases.",
    //               example:
    //                 "A trainer requests medication for a racehorse that races at Santa Anita Park. If the horse is currently in training at that CHRB-regulated track, you cannot lawfully prescribe via telemedicine. Instead, you must see the horse in person before prescribing any medication.",
    //               helpText:
    //                 "Our platform prompts you to confirm the horse’s racing status at the start of a telehealth consult. If the client indicates the horse is under CHRB jurisdiction, Vetcation automatically blocks new telehealth prescriptions and advises an in-person exam.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqCHRBUnknownStatus",
    //           title: "Verifying the Horse’s Status",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What if a veterinarian unknowingly prescribes medication via telehealth to a horse that is racing or training under the CHRB?",
    //               answer:
    //                 "The law states that the veterinarian’s lack of knowledge is irrelevant if the horse is later found to be racing or training. You must confirm the horse’s status before prescribing. (BPC, § 4826.6, subd. (i)(8).) If you fail to do so, you could be found in violation of AB 1399 even if you were unaware of the horse’s actual training or racing activities.",
    //               example:
    //                 "A client might not mention the horse’s status, or they may provide incomplete information. If you do not document your inquiry and they’re later discovered to be at a CHRB facility, you may face penalties for unlawful telehealth prescribing.",
    //               helpText:
    //                 "We require the client to disclose whether the horse is involved in CHRB-regulated racing or training. This Q&A is recorded in the patient file, providing proof that you verified the horse’s status. If the client answers 'yes,' Vetcation prevents you from issuing a telehealth prescription, helping you avoid regulatory violations.",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     RecordKeepingDocumentation: {
    //       mainTitle: "Record Keeping & Documentation",
    //       mainDescription: `California veterinarians must keep comprehensive medical records for
    // <span class="highlight">three years after the animal’s last visit or consultation</span>.
    // (BPC §§ 4855–4856; 16 CCR § 2032.3). The FAQs below reflect those
    // requirements and explain how Vetcation keeps you compliant.`,
    //       sections: [
    //         {
    //           id: "faqBasicRetention",
    //           title: "Retention Period",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question: "How long must I retain medical records?",
    //               answer: `You must retain records for three years <span class="highlight">after the patient’s last visit. (BPC § 4856).</span>`,

    //               example:
    //                 "If you treat a dog in Jan 2025 and never see it again, you may discard" +
    //                 " the record in Jan 2028.",
    //               helpText:
    //                 "Vetcation automatically tracks the last-visit date and tags records" +
    //                 " for destruction reminders.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqContentOfRecords",
    //           title: "Required Content (16 CCR § 2032.3)",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question: "What details must be included?",
    //               answer:
    //                 "Per <strong>Cal. Code Regs., tit. 16, § 2032.3(a)</strong>, every medical record must be legible and contain:<br>" +
    //                 "(1) Name or initials of the person responsible for entries.<br>" +
    //                 "(2) Name, address and phone number of the client.<br>" +
    //                 "(3) Name or identity of the animal, herd or flock.<br>" +
    //                 "(4) (Except for herds or flocks) age, sex, breed, species, and color of the animal.<br>" +
    //                 "(5) Dates (beginning and ending) of custody of the animal, if applicable.<br>" +
    //                 "(6) A history or pertinent information as it pertains to each animal, herd, or flock’s medical status.<br>" +
    //                 "(7) Data, including that obtained by instrumentation, from the physical examination.<br>" +
    //                 "(8) Treatment and intended treatment plan, including medications, dosages, <em>route of administration</em>, and <em>frequency of use</em>.<br>" +
    //                 "(9) For surgical procedures: description of the procedure, name of the surgeon, sedative/anesthetic agents used, their route of administration, and strength if available in more than one strength.<br>" +
    //                 "(10) Diagnosis or assessment prior to performing a treatment or procedure.<br>" +
    //                 "(11) If relevant, a prognosis of the animal’s condition.<br>" +
    //                 "(12) All medications and treatments prescribed and dispensed, including strength, dosage, route of administration, quantity, and frequency of use.<br>" +
    //                 "(13) Daily progress, if relevant, and disposition of the case.",
    //               example: `
    //         <ul>
    //           <li><strong>Telehealth consult – 5 Apr 2025</strong></li>
    //           <li>(1) Entry by Dr. G. Chen (GC)</li>
    //           <li>(2) Client: Jane Smith, 123 Maple Ave, Los Angeles CA 90001; (310) 555-1234</li>
    //           <li>(3) Patient: “Buddy,” individual dog</li>
    //           <li>(4) Labrador Retriever, male/neutered, 4 yrs, yellow coat</li>
    //           <li>(5) Custody dates: 5 Apr 2025 – ongoing</li>
    //           <li>(6) History: 3-day left-ear discharge & scratching</li>
    //           <li>(7) Exam data: Otoscopic – erythematous canal, brown exudate; Temp 101.4 °F</li>
    //           <li>(8) Plan: Ear flush today; <strong>gentamicin-betamethasone otic drops</strong> 2 gtt AU <em>BID</em> × 7 d</li>
    //           <li>(9) N/A – no surgery performed</li>
    //           <li>(10) Diagnosis: Otitis externa (bacterial/yeast)</li>
    //           <li>(11) Prognosis: Good</li>
    //           <li>(12) Medication dispensed: gentamicin-betamethasone 5 mL; strength 3 mg/mL; 2 gtt AU BID × 7 d</li>
    //           <li>(13) Daily progress (Day 1): Owner reports mild pruritus; no adverse effects</li>
    //         </ul>
    //       `,
    //               helpText:
    //                 "Vetcation’s note template maps one-to-one with each § 2032.3(a) item and prevents closure of a consult until all required fields are completed.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqProvidingRecords",
    //           title: "Providing Records / Summaries",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question: "Can I give a summary instead of the full record?",
    //               answer:
    //                 "Yes. <strong>Cal. Code Regs., tit. 16, § 2032.3(b)</strong> states:<br>" +
    //                 "• Records must be kept for <em>three years after the animal’s last visit</em>.<br>" +
    //                 "• A summary of an animal’s medical records shall be made available to the client <em>within five (5) days</em>—or sooner if the animal is critical—upon request.<br>" +
    //                 "The summary must include:<br>" +
    //                 "(1) Name and address of client and animal.<br>" +
    //                 "(2) Age, sex, breed, species, and color of the animal.<br>" +
    //                 "(3) History or pertinent information as it pertains to the animal’s medical status.<br>" +
    //                 "(4) Data, including that obtained by instrumentation, from the physical examination.<br>" +
    //                 "(5) Treatment and intended treatment plan, including medications, their dosage and frequency of use.<br>" +
    //                 "(6) All medications and treatments prescribed and dispensed, including strength, dosage, <em>route of administration</em>, quantity, and frequency of use.<br>" +
    //                 "(7) Daily progress, if relevant, and disposition of the case.",
    //               example: `
    //         <ul>
    //           <li><strong>Client/Animal:</strong> Jane Smith, 123 Maple Ave, LA CA 90001 / “Buddy,” Labrador, M/N, 4 yrs, yellow</li>
    //           <li><strong>History:</strong> Three-day left-ear discharge & scratching</li>
    //           <li><strong>Exam data:</strong> Otoscopic—erythema, brown exudate; Temp 101.4 °F</li>
    //           <li><strong>Treatment plan:</strong> Ear flush today; <em>gentamicin-betamethasone drops</em>—strength 3 mg/mL; 2 gtt AU <em>BID × 7 d</em></li>
    //           <li><strong>Medications dispensed:</strong> Gentamicin-betamethasone 5 mL bottle; 2 gtt AU BID × 7 d (route: otic; quantity: 1 bottle)</li>
    //           <li><strong>Progress:</strong> Day 1—mild pruritus, no adverse effects</li>
    //           <li><strong>Disposition:</strong> Re-check video call in 1 week</li>
    //         </ul>
    //       `,
    //               helpText:
    //                 "Vetcation’s >Export → Generate Summary tool auto-pulls every § 2032.3(b) element, inserts your e-signature, and produces a PDF. The timer ensures delivery within five days (or sooner if you mark the case critical).",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqTelehealthVsInPerson",
    //           title: "Telehealth vs. In-Person Records",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Are the recordkeeping requirements different for telehealth appointments compared to in-person visits?",
    //               answer:
    //                 "No. You must maintain the same standard of documentation regardless of how the VCPR was established or how the consultation took place. The law treats telehealth records the same as in-person records in terms of confidentiality, retention, and content. (BPC §§ 4855, 4856.)",
    //               example:
    //                 "Whether you physically examine a cat at your clinic or diagnose it via synchronous audio-video, you must record your findings, treatment plan, and client communications in the same level of detail.",
    //               helpText:
    //                 "Our platform seamlessly integrates telehealth records with any in-person data you upload, so your patient’s file remains complete and consistent.",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     MiscellaneousClarifications: {
    //       mainTitle: "Additional FAQs & Clarifications",
    //       mainDescription: `Below are extra questions and answers addressing corner cases and nuanced
    //       scenarios that may still be confusing under California’s AB 1399. While not
    //       specifically addressed in the earlier sections, these clarifications can help
    //       veterinarians navigate unique or evolving circumstances in telehealth practice.`,
    //       sections: [
    //         {
    //           id: "faqMultiStateLicense",
    //           title: "Multiple State Licenses & Traveling Patients",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can a California-licensed veterinarian continue providing telehealth to a pet that travels out of California?",
    //               answer:
    //                 "No. A California license only authorizes telehealth services when the animal is physically in California. If the pet leaves California, only a veterinarian licensed in the state where the pet is located may provide telehealth— and only if that state’s laws permit it.",
    //               example:
    //                 "<ul>" +
    //                 "<li><strong>Scenario:</strong> Buddy travels with his owner from Los Angeles to Portland.</li>" +
    //                 "<li><strong>CA Vet:</strong> Cannot continue telehealth consults while Buddy is in Oregon.</li>" +
    //                 "<li><strong>OR Vet:</strong> May provide telehealth only if licensed in Oregon and if Oregon telehealth rules allow it.</li>" +
    //                 "</ul>",
    //               helpText:
    //                 "Vetcation’s scheduling and location checks block new telehealth bookings when the system detects the pet is outside California, ensuring only appropriately-licensed veterinarians can see the patient.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqNoSynchronousVideo",
    //           title: "Telehealth Without Video (Phone or Text Only)",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "If I only speak with a client on the phone (or by text/email) and never see the animal via video or in person, does that count as telehealth under AB 1399?",
    //               answer:
    //                 "Yes, these communications can still be considered telehealth, but you cannot establish a valid VCPR solely through non-visual means (phone, email, or text). Under AB 1399, the veterinarian must use synchronous audio-video to perform an exam if the VCPR hasn’t already been established in person. Phone calls, emails, or text messages may supplement an existing VCPR, but they cannot replace the initial real-time video or in-person exam requirements. (BPC, § 4826.6, subds. (b)(2), (d).)",
    //               example:
    //                 "A client calls you about their dog’s cough but you’ve never met the animal. Messaging guidance alone cannot establish a new VCPR — you’d either need to see the dog in person or conduct a live video exam before diagnosing or prescribing.",
    //               helpText:
    //                 "Vetcation supports text or chat-based follow-ups for minor adjustments once the VCPR is formed (via in-person or synchronous video). Our interface keeps a clear record of these communications, ensuring continuity of care without violating AB 1399.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqInconclusiveExam",
    //           title: "When Telehealth Exam Is Inconclusive",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What if I attempt a telehealth exam via live video but find I cannot accurately diagnose or assess the animal’s condition? Am I required to refer them for an in-person exam?",
    //               answer:
    //                 "Yes. If, at any point, you determine that a telehealth exam (even synchronous audio-video) is insufficient to meet the standard of care, you must advise the client to schedule an in-person visit. Telehealth is only permissible when it allows you to gather enough information to make safe, informed medical decisions. If that isn’t possible, continuing solely via telehealth would be inappropriate — and could subject you to disciplinary action if an error occurs. (BPC, § 4826.6, subd. (c).)",
    //               example:
    //                 "During a video consult for a limping horse, you realize you cannot adequately evaluate lameness without hands-on palpation or diagnostic imaging. You tell the owner they must schedule an in-person exam before you can prescribe or finalize a diagnosis.",
    //               helpText:
    //                 "Vetcation’s platform includes documentation prompts to note 'telehealth insufficient, recommended in-person exam.' This ensures transparency in your medical record if the Board later reviews why you referred the animal for in-person care.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqSecondOpinion",
    //           title: "Second Opinions Via Telehealth",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Can I provide a telehealth-based second opinion directly to the client when another veterinarian already has a VCPR?",
    //               answer:
    //                 "No—unless you fall within the limited shared-practice exception in 16 CCR § 2032.15 (e.g., you and the primary veterinarian work at the same physical location and you have full access to the chart). A veterinarian-to-veterinarian consult is always allowed, but giving advice or prescriptions directly to the owner requires you to establish your own VCPR.",
    //               example:
    //                 "The primary vet emails you radiographs for input. You may discuss findings with that vet, but you may not video-chat with the owner or prescribe medication unless you first establish your own VCPR or the § 2032.15 exception applies.",
    //               helpText:
    //                 "Vetcation supports true peer-to-peer consults by limiting direct client access until you open a compliant VCPR encounter.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqEuthanasia",
    //           title: "Euthanasia Considerations via Telehealth",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Is it legal to perform euthanasia or guide a client through it via telehealth?",
    //               answer:
    //                 "No. Because controlled substances are involved and a VCPR formed solely by telehealth cannot support prescribing or administering those drugs, euthanasia must be performed in person under a valid in-person VCPR. (BPC § 4826.6(i)(6)).",
    //               example:
    //                 "A rural client requests video guidance to administer pentobarbital. You must decline and refer them to an in-person service.",
    //               helpText:
    //                 "If a client raises the request inside Vetcation, the system displays a canned message explaining that euthanasia requires an on-site veterinarian.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqVetLocationRegistration",
    //           title: "Telehealth From an Unregistered Home Office",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Do I need a registered veterinary premises if I practice only by telehealth?",
    //               answer:
    //                 `Under B&P § 4853(h), the location where you practice telehealth is exempt from the registration requirement <span class="highlight">only if</span> you satisfy <span class="highlight">all</span> of the following:<br>` +
    //                 `1. You do <span class="highlight">not</span> perform any in-person examinations or treatments at that location;<br>` +
    //                 `2. You keep <span class="highlight">no</span> veterinary drugs, medicines, appliances, or medical equipment there;<br>` +
    //                 "3. You create, maintain, and store all medical records (per §§ 4855 & 4856) so they’re protected from unauthorized access, damage, or loss;<br>" +
    //                 "4. Any electronic publication (e.g. your website) where you offer services must prominently display:<br>" +
    //                 "&nbsp;&nbsp;&nbsp;a. Your name, contact information, and California license number;<br>" +
    //                 "&nbsp;&nbsp;&nbsp;b. Instructions for clients to obtain copies of their medical records;<br>" +
    //                 "&nbsp;&nbsp;&nbsp;c. A statement that clients may contact the Veterinary Medical Board with questions or complaints.<br>" +
    //                 `If <span class="highlight">any</span> of these conditions aren’t met, you must register the location as a veterinary premises under §§ 4853(a)–(c).`,
    //               example: `<ul>
    //            <li><strong>Scenario:</strong> You consult exclusively via video from your home office.</li>
    //            <li>You never see patients in person there.</li>
    //            <li>You store no drugs or equipment on-site.</li>
    //            <li>All records are encrypted and access-controlled off-site.</li>
    //            <li>Your website footer shows: Dr. Jane Doe, DVM #12345; “For medical records requests, email records@example.com”; “Call the CA Veterinary Medical Board at (916) 515-5220 for questions.”</li>
    //          </ul>`,
    //               helpText:
    //                 "Vetcation’s onboarding checks each § 4853(h) condition. If any fail, we guide you through submitting a premises-registration application to the Board—ensuring full compliance with state law.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqClinicPremises",
    //           title: "Telehealth From a Registered Clinic",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "Our clinic already has a California Premises Permit. Do our veterinarians need a separate registration to use Vetcation for telehealth?",
    //               answer: `No. When telehealth is delivered <span class="highlight">from an address that already holds a valid Veterinary Premises Permit</span>, the location is \u003cstrong\u003ealready\u003c/strong\u003e registered under B&P §§ 4853 (a)–(c). The § 4853(h) exemption is irrelevant because the clinic is not an unregistered site.`,
    //               example: `<ul>
    //         <li><strong>Scenario:</strong> Maple Veterinary Hospital (Premises #VET-1234) adds video visits via Vetcation.</li>
    //         <li>All telehealth sessions originate from the clinic building.</li>
    //         <li>No extra premises paperwork is required—the existing permit covers on-site, mobile, and telehealth care.</li>
    //       </ul>`,
    //               helpText:
    //                 "During onboarding, clinic admins simply enter the existing Premises Permit number. Vetcation records the permit and allows all associated vets to begin video consults immediately.",
    //             },
    //           ],
    //         },
    //         {
    //           id: "faqMixedWorkflows",
    //           title: "Mixed Workflows: Clinic & Home Office",
    //           blocks: [
    //             {
    //               type: "qa",
    //               question:
    //                 "What if I sometimes consult from the clinic and sometimes from my home office?",
    //               answer: `When you consult <span class="highlight">inside the registered clinic</span>, you are covered by that premises permit. When you consult <span class="highlight">from home</span>, your home office must either meet <strong>all</strong> four conditions in B&P § 4853(h) <em>or</em> be registered as a separate premises.`,
    //               example: `<ul>
    //         <li>Clinic shift   →  video visit from Maple Veterinary Hospital (covered under Premises #VET-1234).</li>
    //         <li>Evening shift  →  video visit from your home office.</li>
    //         <li>Home office complies with § 4853(h): no in-person exams, no drugs on site, cloud-based records, required footer posted.</li>
    //         <li>If you ever stock medications at home, the exemption is lost and a home-office premises registration is mandatory.</li>
    //       </ul>`,
    //               helpText:
    //                 "Vetcation lets you tag each telehealth session with its originating location. If you select “Home Office,” the platform runs the § 4853(h) checklist; if any item fails, it warns you to register the site before scheduling new sessions.",
    //             },
    //           ],
    //         },
    //       ],
    //     },
  },

  // export default content; // if you are using modules
  corporations: {
    corpIntroToVetcation: {
      mainTitle: "Introduction for Corporate Veterinary Groups",
      mainDescription: `Vetcation enables multi-hospital organizations to launch a legally compliant, hospital-branded telemedicine and virtual network in days with zero workflow changes. Every clinic can partner with their trusted relief veterinarians to expand capacity, add services, and strengthen client loyalty. The partnered relief vets are responsible for all telemedicine outcomes and liability. Your clinics keep ownership of client relationships and records and receive a clear clinic share on every visit. Vetcation aligns with California AB 1399 and provides audit-ready documentation for compliance teams.`,
      sections: [
        {
          id: "missionForCorporations",
          title: "Our Mission",
          blocks: [
            {
              type: "paragraph",
              text: `Vetcation is designed to address a core challenge in multi-hospital operations: <span class="highlight">staff turnover and hiring challenges</span>.  Most teams are overworked and understaffed. When client conflict and callback overload pile up, these pressures drive burnout and turnover. Hiring full-time doctors is hard amid a nationwide veterinarian shortage, and many veterinarians prefer flexible schedules. Clinics often rely on relief vets to cover staffing gaps, but that alone is hard to sustain—especially since clients value long-term relationships with preferred doctors.`,
            },
            {
              type: "root",
              helpText: `We believe the root cause is a gap in structured, incentive-aligned collaboration. By partnering with your trusted relief veterinarians to offer telemedicine services, each clinic can instantly expand capacity without adding payroll, create a new revenue stream to fund competitive wages, and focus in house teams on high-value care that truly requires hands on work (imaging, labs, dentistry, surgery). Clinics reduce callback overload, improve service for in-person clients, and build one tap away, lasting client relationships, which in turn reduces burnout and eases hiring challenges. Vetcation turns real-world relationships into a unified professional network with shared records, clear responsibility, and transparent economics. The stronger the professional connections, the better the outcomes for patients, teams, and the business.`,
            },
          ],
        },

        {
          id: "organizationalOutcomes",
          title: "What Can Your Organization Achieve with Vetcation?",
          blocks: [
            {
              type: "paragraph",
              text: "Stand up a hospital-branded virtual network that increases capacity, protects teams, and grows revenue while preserving control of client relationships and records.",
            },
            //add image
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0839.webp?alt=media&token=cb65b265-1c74-42ea-a8d8-bea0a09f2e38",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0848.webp?alt=media&token=402221cd-81a0-45ee-8df2-f39e618494f9",
              ],
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Leverage California scale (PetVet example):",
                  lines: [
                    "PetVet operates ~100 hospitals in California, of which ~85 are GP.",
                    "At an average of 3 in-house doctors per hospital, that is ~300 employed DVMs.",
                    "California has ~7,690 employed veterinarians overall, and ~460–700 of them work as relief. Vetcation connects this workforce directly to your hospitals.",
                  ],
                },

                {
                  heading: "Expand capacity without payroll:",
                  lines: [
                    "Relief veterinarians set their own schedules, fees, and handle liability. Once partnered, their availability appears to clients under your hospital brand.",
                    "This can effectively double available appointment slots without adding headcount.",
                  ],
                },

                {
                  heading: "Transparent economics:",
                  lines: [
                    "Per-visit split: provider 60%, clinic 25%, platform 15%.",
                    "At a $100 average visit fee and 20 virtual visits per week per doctor, the clinic’s 25% share ≈ $26,000 net income per doctor per year (52 weeks).",
                    "If a clinic partners with 3 virtual doctors, that’s ≈ $78,000 net income per clinic per year.",
                    'Across ~100 California hospitals, that’s <span class="highlight">~$7.8M in additional annual net income to clinics</span> — without adding payroll.',
                    "Automatic payouts and audit-ready statements keep finance in control.",
                  ],
                },
                {
                  heading: "Add new services at scale:",
                  lines: [
                    "Clinic-branded telemedicine, structured follow-ups through Vetssenger, and optional services from board-certified specialists and certified trainers.",
                    "Follow-up fees are automatically shared with the partnered clinic, reinforcing client loyalty.",
                  ],
                },
                {
                  heading: "Keep ownership and continuity:",
                  lines: [
                    "Clinics approve partnerships, records are shared on request, and escalations return into your in-person workflow.",
                    "Clients remain tied to your brand with one-tap follow-up care.",
                  ],
                },

                {
                  heading: "Ensure AB 1399 alignment:",
                  lines: [
                    "Document VCPR establishment where applicable and maintain audit-ready visit records and follow-ups.",
                  ],
                },
              ],
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_1031.webp?alt=media&token=7a81a522-f6cd-4428-b1d5-81ea4e609754",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0853.webp?alt=media&token=420b61b1-454e-48da-a1c0-0bbc98b2ac20",
              ],
            },
          ],
        },
        {
          id: "earlyAdopterAdvantage",
          title: "Early adopter advantage",
          blocks: [
            {
              type: "paragraph",
              text: "Early adopter advantage: clinics that join now lock in provider relationships and community visibility that are hard for late adopters to match.",
            },
            {
              type: "bulletList",
              items: [
                {
                  heading: "Build your relief-vet network first:",
                  lines: [
                    "Connect with California ~ 700 relief DVMs and specialists before competitors do, converting trusted partners into your extended workforce.",
                    "Late adopters will need to convince those same professionals to add another hospital relationship, which takes longer and costs more.",
                  ],
                },
                {
                  heading: "Own the community demand curve:",
                  lines: [
                    "As new pet owners post questions, your approved professionals appear in more threads and topics, continually marketing your brand without extra ad spend.",
                  ],
                },
                {
                  heading: "Statewide telemedicine under your brand:",
                  lines: [
                    "Turn on a hospital-branded virtual front door for all California pet owners immediately.",
                    "The earlier you launch, the stronger and stickier your client relationships become, making you harder to displace.",
                  ],
                },
              ],
            },
            {
              type: "paragraph",
              text: "For partnership discussions, contact Geoff Chen (gcfchen@gmail.com, (530) 400-6227).",
            },
            {
              type: "framedImage",
              imageSrcs: [
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/IMG_7383_compressed.png?alt=media&token=4f4cc1eb-073b-4a46-acba-1dedd89943ad",
                "https://firebasestorage.googleapis.com/v0/b/vetcationapp.appspot.com/o/website%2FIMG_0850.webp?alt=media&token=2b09333e-b495-4f1a-9597-0cab3594b7ec",
              ],
            },
          ],
        },

        {
          id: "operatingModel",
          title: "Operating Model",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Care delivery",
                  lines: [
                    "Licensed providers — relief DVMs and board-certified specialists — deliver telemedicine consults and structured follow-ups in Vetssenger under your hospital brand.",
                    "Certified dog trainers may also offer independent education and behavior-coaching services to pet owners and appear as partnered with your clinic; they do not diagnose or prescribe.",
                    "Providers set their own schedules. Hospitals approve who is visible as partnered providers; adding trusted providers increases bookable time slots and client choice.",
                    "All visit notes and summaries are shared with the hospital, and escalations return to standard in-person workflows.",
                  ],
                },
                {
                  heading: "Clinic role",
                  lines: [
                    "Approve or deny provider partnerships on a per-hospital basis.",
                    "Share records upon owner request. Handle escalations in person using existing workflows.",
                    "Send a single announcement email to clients that telemedicine is available with trusted relief vets.",
                  ],
                },
                {
                  heading: "Responsibility and liability",
                  lines: [
                    "Telemedicine outcomes are the responsibility of the relief veterinarian.",
                    "In-person care is the responsibility of the clinic after escalation.",
                  ],
                },
                {
                  heading: "Payments and revenue share",
                  lines: [
                    "All visits run through Vetcation wallet rails with Stripe Connect.",
                    "Automatic split on each visit: provider 60 percent, clinic 25 percent, platform 15 percent.",
                    "Monthly payouts with downloadable statements for finance.",
                  ],
                },
              ],
            },
          ],
        },

        {
          id: "faqs",
          title: "FAQs for Corporate Teams",
          blocks: [
            {
              type: "qa",
              question:
                "Who is responsible for telemedicine outcomes and liability?",
              answer:
                "Relief veterinarians are responsible for all telemedicine outcomes. When a case escalates and is seen in person, the clinic is responsible for on-site care under standard policies.",
            },
            {
              type: "qa",
              question: "Do clinics lose control of the client relationship?",
              answer:
                "No. Clinics approve partnerships, records are shared, and clients remain under the hospital brand. Escalations and follow-up care return to the clinic.",
            },
            {
              type: "qa",
              question: "What internal changes are required?",
              answer:
                "No workflow changes are required. Clinics continue using current intake, scheduling, and treatment processes. Vetcation adds a virtual front door staffed by trusted relief veterinarians.",
            },
            {
              type: "qa",
              question: "How do payouts and finance reporting work?",
              answer:
                "All visits run through Vetcation wallet rails. Stripe Connect performs automated monthly payouts. Finance teams can download statements and exports for reconciliation.",
            },
          ],
        },
        {
          id: "whyVirtualCareTrend",
          title: "Why Virtual Care Is Growing — And Why It Matters",
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
                    `Over 22% of U.S. counties have no veterinary employees, leaving millions of companion animals in underserved areas (VVCA Report 2024, p. 7).`,
                    `The country faces a deficit of 12,000 veterinarians and 48,000 support staff, demanding innovative solutions like telemedicine (VVCA Report 2024, p. 7).`,
                  ],
                },
                {
                  heading: "Rapid Consumer Adoption:",
                  lines: [
                    "Telehealth has become a key access point for pet owners seeking immediate answers — 50% of global virtual consults address symptomatic issues (VVCA Report 2024, p. 10).",
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
                    "Virtual interactions garner an average 98.4% satisfaction rate — pet owners appreciate the convenience and immediate access to professional advice (VVCA Report 2024, p. 14).",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  rvts: {
    introToRVT: {
      mainTitle: "Registered Veterinary Technicians (RVTs)",
      mainDescription: `SB 669 (B&P Code § 4826.7) took effect on January 1, 2024, expanding the scope of practice for California RVTs. Under written protocols from a supervising veterinarian, an RVT may now establish a veterinarian–client–patient relationship (VCPR), perform wellness exams, and administer core vaccines and parasite preventives off-site—helping close critical preventive-care gaps across the state.`,
      sections: [
        {
          id: "legalFramework",
          title: "1 Legal Framework",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "SB 669 scope",
                  lines: [
                    "Permits an RVT, acting as the veterinarian’s agent, to perform wellness exams and administer vaccines or parasite preventives when the supervising veterinarian is easily and quickly available by phone or video.",
                  ],
                },
                {
                  heading: "Preventive care only",
                  lines: [
                    "Applies exclusively to preventive services; diagnosis, surgery, and controlled-drug administration remain reserved for veterinarians.",
                  ],
                },
                {
                  heading: "Written delegation",
                  lines: [
                    "Requires a signed Delegation & Agency Agreement between the veterinarian and RVT before any clinic session.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "preClinicRequirements",
          title: "2 Pre-Clinic Requirements",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Written protocols",
                  lines: [
                    "The supervising DVM supplies step-by-step instructions covering patient triage, drug handling, dosage charts, and emergency response.",
                  ],
                },
                {
                  heading: "Emergency readiness",
                  lines: [
                    "When operating off a registered premises, the RVT must carry epinephrine, diphenhydramine, IV fluids, and the equipment listed in the SF SPCA checklist.",
                  ],
                },
                {
                  heading: "Client disclosure & consent",
                  lines: [
                    "The RVT must state their role, provide the supervising veterinarian’s name and license number, and record the client’s consent in the medical record before treatment begins.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "onSiteWorkflow",
          title: "3 On-Site Workflow",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Patient assessment",
                  lines: [
                    "Use the SB 669 suitability checklist (e.g., temperature ≤ 102.5 °F, no severe illness signs).",
                  ],
                },
                {
                  heading: "VCPR establishment",
                  lines: [
                    "Automatically established once the RVT completes the exam on the veterinarian’s behalf.",
                  ],
                },
                {
                  heading: "Vaccine/medication administration",
                  lines: [
                    "Administer exactly as per protocol (species-specific dose, limb/site rotation, sterile technique).",
                  ],
                },
                {
                  heading: "Post-injection observation",
                  lines: [
                    "Observe for 15 minutes, manage any reactions per the emergency algorithm, then discharge with written after-care instructions.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "platformSupport",
          title: "4 Vetcation Platform Support",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Digital delegation forms",
                  lines: [
                    "Collected and stored with cryptographic signatures for audit readiness.",
                  ],
                },
                {
                  heading: "Protocol-embedded checklists",
                  lines: [
                    "Guide the RVT through each legal checkpoint in real time.",
                  ],
                },
                {
                  heading: "Telehealth bridge",
                  lines: [
                    "AB 1399-compliant video/phone consult access keeps the supervising DVM one tap away.",
                  ],
                },
                {
                  heading: "Instant record-sync",
                  lines: [
                    "SOAP notes, consent confirmations, and lot numbers upload automatically to the veterinarian’s dashboard.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "useCases",
          title: "5 Use-Cases We Enable",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading: "Shelter vaccine clinics",
                  lines: [
                    "RVT-led events boosting herd immunity without an on-site veterinarian.",
                  ],
                },
                {
                  heading: "House-call wellness visits",
                  lines: [
                    "Core vaccines and monthly preventives delivered in-home.",
                  ],
                },
                {
                  heading: "Community pop-ups",
                  lines: [
                    "Pairing RVT services with virtual vet oversight in underserved neighborhoods.",
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "references",
          title: "6 Reference Materials",
          blocks: [
            {
              type: "bulletList",
              items: [
                {
                  heading:
                    "SF SPCA Vaccine Clinic Protocols & Procedures (March 2024)",
                  lines: [],
                },
                {
                  heading:
                    "California Business & Professions Code § 4826.7 (SB 669, 2023)",
                  lines: [],
                },
                {
                  heading: "Vetcation Emergency Drug & Equipment List v2.0",
                  lines: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  compliance: {},

  // Similarly for the other topNav items...
};

const sharedKeys = [
  "Bill1399",
  "VCPR",
  "PrescriptionLimits",
  "PrivacyConfidentiality",
  "RacehorseCHRBRestrictions",
  "RecordKeepingDocumentation",
  "MiscellaneousClarifications",
];

sharedKeys.forEach((k) => {
  contentData.corporations[k] = contentData.home[k];
  contentData.clinics[k] = contentData.home[k];
  contentData.compliance[k] = contentData.home[k];
});

export default contentData;
