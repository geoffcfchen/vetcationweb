// src/components/ShelterContactSection.jsx
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { FaEnvelope, FaHeart, FaPaw, FaBuilding } from "react-icons/fa";

const FN_SUBMIT_SHELTER_INTEREST =
  import.meta.env.VITE_FN_SUBMIT_SHELTER_INTEREST ||
  "https://us-central1-vetcationapp.cloudfunctions.net/submitShelterInterest";

const Section = styled.section`
  background: #f3f0e8;
  padding: 28px 20px 84px;
`;

const Max = styled.div`
  max-width: 1160px;
  margin: 0 auto;
`;

const Wrap = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 24px;
  align-items: stretch;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background: #1f2933;
  border-radius: 12px;
  padding: 36px 32px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #31404d;
`;

const LeftTop = styled.div``;

const Kicker = styled.div`
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d9c7a2;
  font-weight: 700;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(217, 199, 162, 0.28);
`;

const LeftTitle = styled.h2`
  margin: 18px 0 14px;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.02;
  color: #ffffff;
  font-weight: 700;
  max-width: 420px;
`;

const LeftBody = styled.p`
  margin: 0;
  font-size: 17px;
  line-height: 1.75;
  color: #d7dee4;
  max-width: 520px;
`;

const Points = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 30px;
`;

const Point = styled.div`
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #edf2f7;
  font-size: 15px;
  line-height: 1.55;

  svg {
    margin-top: 3px;
    color: #d9c7a2;
    flex: 0 0 auto;
  }
`;

const BottomRule = styled.div`
  margin-top: 30px;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(217, 199, 162, 0.9) 0%,
    rgba(217, 199, 162, 0.35) 38%,
    rgba(217, 199, 162, 0.06) 100%
  );
`;

const RightCard = styled.div`
  background: #fcfbf7;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #d8d2c4;
  box-shadow: 0 10px 24px rgba(24, 32, 38, 0.05);

  @media (max-width: 640px) {
    padding: 22px 18px;
  }
`;

const FormEyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a6e57;
  font-weight: 700;
`;

const FormTitle = styled.h3`
  margin: 10px 0 8px;
  font-size: 34px;
  line-height: 1.08;
  color: #17212b;
  font-weight: 700;
`;

const FormSubhead = styled.p`
  margin: 0 0 24px;
  font-size: 16px;
  line-height: 1.7;
  color: #4f5d6b;
  max-width: 640px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #1d2731;
`;

const Required = styled.span`
  color: #b42318;
  margin-left: 2px;
`;

const HelpText = styled.div`
  font-size: 13px;
  color: #66717c;
`;

const sharedInputStyles = `
  width: 100%;
  border-radius: 8px;
  border: 1px solid #cfc6b4;
  background: #ffffff;
  color: #17212b;
  padding: 13px 14px;
  font-size: 15px;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;

  &::placeholder {
    color: #8b96a1;
  }

  &:focus {
    border-color: #8f7750;
    box-shadow: 0 0 0 3px rgba(143, 119, 80, 0.14);
  }
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const Select = styled.select`
  ${sharedInputStyles}
`;

const TextArea = styled.textarea`
  ${sharedInputStyles}
  min-height: 132px;
  resize: vertical;
`;

const RadioWrap = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 4px;
`;

const RadioOption = styled.label`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 12px;
  border: 1px solid #ddd4c4;
  border-radius: 8px;
  background: #fffdfa;
  font-size: 15px;
  color: #22303c;
  cursor: pointer;
  transition:
    border-color 120ms ease,
    background 120ms ease;

  &:hover {
    border-color: #b7aa92;
    background: #ffffff;
  }

  input {
    margin-top: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  border: none;
  background: #2b4a5a;
  color: #ffffff;
  border-radius: 8px;
  padding: 14px 22px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  min-width: 150px;
  transition:
    transform 120ms ease,
    background 120ms ease,
    box-shadow 120ms ease;

  &:hover {
    background: #213a47;
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(33, 58, 71, 0.18);
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
    transform: none;
    box-shadow: none;
  }
`;

const EmailLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2b4a5a;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #b42318;
  margin-top: 16px;
`;

const InlineError = styled.div`
  font-size: 13px;
  color: #b42318;
  margin-top: 2px;
`;

const SuccessBox = styled.div`
  border: 1px solid #b7d3c0;
  background: #eef8f1;
  color: #1d5b36;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 15px;
  line-height: 1.5;
  margin-top: 18px;
`;

const FinePrint = styled.p`
  margin: 18px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #6a7280;
`;

const HiddenInput = styled.input`
  display: none;
`;

const organizationOptions = [
  "Animal Shelter: Government",
  "Animal Shelter: Nonprofit",
  "Animal Rescue Organization",
  "Municipal Shelter Partner",
  "Shelter Medicine Team",
  "Other",
];

const softwareOptions = [
  "",
  "Shelterluv",
  "Chameleon",
  "PetPoint",
  "AnimalsFirst",
  "Buzz to the Rescues",
  "RescueGroups.org",
  "Homegrown / Internal System",
  "Other / Not sure",
];

const initialForm = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  email: "",
  organizationName: "",
  organizationType: "",
  shelterSoftware: "",
  message: "",
  website: "",
};

function validateForm(form) {
  const next = {};

  if (!form.firstName.trim()) next.firstName = "First name is required.";
  if (!form.email.trim()) next.email = "Email is required.";
  if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
    next.email = "Please enter a valid email.";
  }
  if (!form.organizationName.trim()) {
    next.organizationName = "Organization name is required.";
  }
  if (!form.organizationType.trim()) {
    next.organizationType = "Please choose an organization type.";
  }

  return next;
}

export default function ShelterContactSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const mailtoHref = useMemo(() => {
    const to = "gcfchen@vetcation.com";
    const subject = encodeURIComponent(
      `Shelter Partnership Inquiry: ${form.organizationName || "My organization"}`,
    );
    const body = encodeURIComponent(
      [
        `First name: ${form.firstName}`,
        `Last name: ${form.lastName}`,
        `Job title: ${form.jobTitle}`,
        `Email: ${form.email}`,
        `Organization name: ${form.organizationName}`,
        `Organization type: ${form.organizationType}`,
        `Shelter software: ${form.shelterSoftware}`,
        "",
        "Message:",
        form.message,
      ].join("\n"),
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    if (serverError) {
      setServerError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const resp = await fetch(FN_SUBMIT_SHELTER_INTEREST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          jobTitle: form.jobTitle.trim(),
          email: form.email.trim().toLowerCase(),
          organizationName: form.organizationName.trim(),
          organizationType: form.organizationType.trim(),
          shelterSoftware: form.shelterSoftware.trim(),
          message: form.message.trim(),
          website: form.website.trim(),
          source: "for-shelter-page",
        }),
      });

      const json = await resp.json().catch(() => null);

      if (!resp.ok || !json?.ok) {
        throw new Error(json?.error || "Unable to submit your form.");
      }

      setSubmitted(true);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setServerError(error.message || "Unable to submit your form.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section id="shelter-contact">
      <Max>
        <Wrap>
          <LeftPanel>
            <LeftTop>
              <Kicker>Partner with MyPet Health</Kicker>
              <LeftTitle>Start the conversation</LeftTitle>
              <LeftBody>
                We help shelters and rescue groups send adopters home with a
                lifelong medical record, better continuity, and less paperwork
                friction after adoption.
              </LeftBody>

              <Points>
                <Point>
                  <FaHeart />
                  <span>
                    Give each adopted pet a medical record that can continue to
                    grow over time
                  </span>
                </Point>

                <Point>
                  <FaBuilding />
                  <span>
                    Reduce repeated post-adoption requests for records and
                    discharge information
                  </span>
                </Point>

                <Point>
                  <FaPaw />
                  <span>
                    Help adopters stay connected with veterinary support after
                    they bring the pet home
                  </span>
                </Point>
              </Points>
            </LeftTop>

            <BottomRule aria-hidden="true" />
          </LeftPanel>

          <RightCard>
            <FormEyebrow>Contact</FormEyebrow>
            <FormTitle>Talk to our team</FormTitle>
            <FormSubhead>
              Fill out this form and we’ll get back to you shortly.
            </FormSubhead>

            <form onSubmit={handleSubmit} noValidate>
              <FormGrid>
                <Field>
                  <Label htmlFor="shelter-first-name">
                    First name<Required>*</Required>
                  </Label>
                  <Input
                    id="shelter-first-name"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <InlineError>{errors.firstName}</InlineError>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="shelter-last-name">Last name</Label>
                  <Input
                    id="shelter-last-name"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                </Field>

                <Field>
                  <Label htmlFor="shelter-job-title">Job title</Label>
                  <Input
                    id="shelter-job-title"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    autoComplete="organization-title"
                  />
                </Field>

                <Field>
                  <Label htmlFor="shelter-email">
                    Email<Required>*</Required>
                  </Label>
                  <Input
                    id="shelter-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {errors.email && <InlineError>{errors.email}</InlineError>}
                </Field>

                <Field className="full-width">
                  <Label htmlFor="shelter-org-name">
                    Organization name<Required>*</Required>
                  </Label>
                  <Input
                    id="shelter-org-name"
                    name="organizationName"
                    value={form.organizationName}
                    onChange={handleChange}
                    autoComplete="organization"
                  />
                  {errors.organizationName && (
                    <InlineError>{errors.organizationName}</InlineError>
                  )}
                </Field>

                <Field as={FullWidth}>
                  <Label>
                    Organization type<Required>*</Required>
                  </Label>
                  <HelpText>
                    Select the option that best describes your organization.
                  </HelpText>

                  <RadioWrap>
                    {organizationOptions.map((option) => (
                      <RadioOption key={option}>
                        <input
                          type="radio"
                          name="organizationType"
                          value={option}
                          checked={form.organizationType === option}
                          onChange={handleChange}
                        />
                        <span>{option}</span>
                      </RadioOption>
                    ))}
                  </RadioWrap>

                  {errors.organizationType && (
                    <InlineError>{errors.organizationType}</InlineError>
                  )}
                </Field>

                {/* <Field as={FullWidth}>
                  <Label htmlFor="shelter-software">
                    Shelter management software
                  </Label>
                  <HelpText>
                    Optional, but helpful for understanding your current
                    workflow.
                  </HelpText>
                  <Select
                    id="shelter-software"
                    name="shelterSoftware"
                    value={form.shelterSoftware}
                    onChange={handleChange}
                  >
                    <option value="">Please select</option>
                    {softwareOptions.filter(Boolean).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </Field> */}

                <Field as={FullWidth}>
                  <Label htmlFor="shelter-message">Message</Label>
                  <TextArea
                    id="shelter-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us a little about your shelter, adoption flow, or what kind of post-adoption support you are looking for."
                  />
                </Field>
              </FormGrid>

              <HiddenInput
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />

              {serverError && <ErrorText>{serverError}</ErrorText>}

              <Actions>
                <SubmitButton type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </SubmitButton>

                <EmailLink href={mailtoHref}>
                  <FaEnvelope />
                  Email us instead
                </EmailLink>
              </Actions>

              {submitted && (
                <SuccessBox>
                  Thanks. We received your message and will follow up soon.
                </SuccessBox>
              )}

              <FinePrint>
                We use this form only to respond to partnership inquiries and
                discuss how MyPet Health could support your organization.
              </FinePrint>
            </form>
          </RightCard>
        </Wrap>
      </Max>
    </Section>
  );
}
