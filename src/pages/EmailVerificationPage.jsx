// src/pages/EmailVerificationPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import Footer from "../components/Footer";

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #111827;
  display: flex;
  flex-direction: column;
`;

const BrandBar = styled.header`
  padding: 20px 28px;
  font-size: 20px;
  font-weight: 600;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 32px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 24px;
`;

const ErrorBanner = styled.div`
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 14px;
`;

const InfoBanner = styled.div`
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #e5f0ff;
  color: #1d4ed8;
  font-size: 14px;
`;

const BodyText = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  background: #111827;
  color: #f9fafb;

  &:hover {
    background: #000000;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  background: #ffffff;
  color: #111827;

  &:hover {
    background: #f9fafb;
  }
`;

const TermsRow = styled.footer`
  padding: 12px 0 24px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const TermsLink = styled.a`
  color: #6b7280;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function EmailVerificationPage() {
  const [infoMessage, setInfoMessage] = useState(
    "We have sent a verification link to your email. After you click the link, this page will continue once we detect it."
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectToLibrary = () => {
    setInfoMessage(
      "Your email is verified. Redirecting you to your AI library."
    );
    navigate("/ai/library", { replace: true });
  };

  const checkVerificationOnce = async ({ quiet = false } = {}) => {
    if (!quiet) {
      setInfoMessage("");
      setError("");
    }

    const user = auth.currentUser;
    if (!user) {
      if (!quiet) {
        setError("You are not signed in.");
      }
      return;
    }

    try {
      await user.reload();
      if (user.emailVerified) {
        redirectToLibrary();
      } else if (!quiet) {
        setInfoMessage(
          "Your email is still not verified. Please click the verification link in your inbox, then try again."
        );
      }
    } catch (err) {
      console.error("Error checking verification:", err);
      if (!quiet) {
        setError("Could not check verification. Please try again.");
      }
    }
  };

  // Auto polling
  useEffect(() => {
    let canceled = false;
    let intervalId;

    async function initialCheck() {
      if (canceled) return;
      // Quick silent check on mount
      await checkVerificationOnce({ quiet: true });
      if (canceled) return;

      intervalId = window.setInterval(() => {
        checkVerificationOnce({ quiet: true }).catch((err) => {
          console.error("Auto check verification failed:", err);
        });
      }, 5000);
    }

    initialCheck().catch((err) => {
      console.error("Initial verification check failed:", err);
    });

    return () => {
      canceled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []); // runs once

  const handleCheckClick = () => {
    // Manual check for impatient users
    checkVerificationOnce();
  };

  const handleResend = async () => {
    setInfoMessage("");
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("You are not signed in.");
      return;
    }

    try {
      await user.sendEmailVerification();
      setInfoMessage("Verification email sent. Please check your inbox.");
    } catch (err) {
      console.error("Error resending verification email:", err);
      setError("Could not resend verification email. Please try again.");
    }
  };

  return (
    <>
      <Page>
        <BrandBar>Vetcation</BrandBar>

        <Main>
          <Card>
            {error && <ErrorBanner>{error}</ErrorBanner>}
            {infoMessage && <InfoBanner>{infoMessage}</InfoBanner>}

            <Title>Verify your email</Title>

            <BodyText>
              Open the verification email we sent you and tap the link. If you
              keep this page open in the same browser, it will move on
              automatically once we detect that your email is verified.
            </BodyText>

            <ButtonRow>
              <PrimaryButton type="button" onClick={handleCheckClick}>
                I have verified my email
              </PrimaryButton>
              <SecondaryButton type="button" onClick={handleResend}>
                Resend verification email
              </SecondaryButton>
            </ButtonRow>
          </Card>
        </Main>

        <TermsRow>
          <TermsLink href="/SMSTerms/">Terms of Use</TermsLink>
          <span>|</span>
          <TermsLink href="/privacy-policy/">Privacy Policy</TermsLink>
        </TermsRow>
      </Page>

      <Footer />
    </>
  );
}

export default EmailVerificationPage;
