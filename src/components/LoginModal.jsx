// src/components/LoginModal.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { SiGoogle, SiApple, SiMicrosoft } from "react-icons/si";
import { FiPhone, FiX } from "react-icons/fi";
import { getSignInMethods, signInWithGoogle } from "../lib/firebase";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.72);
`;

const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  background: #111827;
  color: #f9fafb;
  border-radius: 18px;
  padding: 26px 26px 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.9);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #1f2933;
    color: #e5e7eb;
  }
`;

const Title = styled.h2`
  margin: 4px 0 4px;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 18px;
  font-size: 14px;
  color: #9ca3af;
  text-align: center;
`;

const Providers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
`;

const ProviderButton = styled.button`
  width: 100%;
  border-radius: 999px;
  border: 1px solid #374151;
  background: #020617;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #e5e7eb;

  &:hover {
    background: #111827;
    border-color: #4b5563;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ProviderIconWrap = styled.span`
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 14px;
  font-size: 11px;
  color: #6b7280;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #27272f;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  color: #d1d5db;
  margin-bottom: 4px;
`;

const EmailInput = styled.input`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #374151;
  background: #020617;
  color: #f9fafb;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 1px #4f46e5;
  }
`;

const PrimaryButton = styled.button`
  margin-top: 12px;
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: #f9fafb;
  color: #020617;

  &:hover {
    background: #e5e7eb;
  }
`;

const FinePrint = styled.p`
  margin: 10px 0 0;
  font-size: 11px;
  color: #6b7280;
  text-align: center;

  a {
    color: #e5e7eb;
    text-decoration: underline;
  }
`;

function LoginModal({ open, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState(""); // NEW

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      // This opens the Google account chooser screen.
      const user = await signInWithGoogle();

      // If user closed the popup, user will be null and we just stop.
      if (!user) {
        return;
      }

      // Close the modal and go to /ai/library
      onClose?.();
      navigate("/ai/library");
    } catch (error) {
      // signInWithGoogle already logs / alerts, so nothing extra needed
      console.error("Google sign in failed in modal:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  // lock scroll and handle Escape only when open
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = original;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const stop = (e) => e.stopPropagation();

  const handleContinue = async () => {
    const trimmed = email.trim();
    setEmailError("");

    if (!trimmed) {
      setEmailError("Email is required");
      return;
    }

    // basic format check
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setEmailError("Invalid email address");
      return;
    }

    try {
      const methods = await getSignInMethods(trimmed);
      // methods is an array of provider IDs, for example:
      // []                 -> no account
      // ["password"]       -> email/password account
      // ["google.com"]     -> Google only
      // ["password","google.com"] -> both linked

      const hasPassword = methods.includes("password");
      const hasGoogle = methods.includes("google.com");

      if (methods.length === 0) {
        // No existing account - go to email registration
        onClose?.();
        navigate(`/register-email?email=${encodeURIComponent(trimmed)}`);
      } else if (hasPassword) {
        // Existing password account - go to LoginPage
        onClose?.();
        navigate(`/login?email=${encodeURIComponent(trimmed)}`);
      } else if (!hasPassword && hasGoogle) {
        // Google only account - guide user to use Google button
        setEmailError(
          "This email is already connected to Google sign in. Please continue with Google."
        );
      } else {
        // Other providers - for now, just show a generic message
        setEmailError(
          "This email is already linked to a different sign in method."
        );
      }
    } catch (err) {
      console.error("Error checking sign in methods:", err);
      setEmailError("Unable to check this email right now. Please try again.");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleContinue();
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" onClick={stop}>
        <CloseButton type="button" onClick={onClose} aria-label="Close">
          <FiX />
        </CloseButton>

        <Title>Log in or sign up</Title>
        <Subtitle>
          You will get smarter responses and can upload files, images, and more.
        </Subtitle>

        <Providers>
          <ProviderButton
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <ProviderIconWrap>
              <SiGoogle />
            </ProviderIconWrap>
            <span>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </ProviderButton>

          {/* <ProviderButton type="button">
            <ProviderIconWrap>
              <SiApple />
            </ProviderIconWrap>
            <span>Continue with Apple</span>
          </ProviderButton> */}

          {/* <ProviderButton type="button">
            <ProviderIconWrap>
              <SiMicrosoft />
            </ProviderIconWrap>
            <span>Continue with Microsoft</span>
          </ProviderButton> */}

          {/* <ProviderButton type="button">
            <ProviderIconWrap>
              <FiPhone />
            </ProviderIconWrap>
            <span>Continue with phone</span>
          </ProviderButton> */}
        </Providers>

        <DividerRow>
          <DividerLine />
          <span>OR</span>
          <DividerLine />
        </DividerRow>

        <div>
          <FieldLabel htmlFor="login-email">Email address</FieldLabel>
          <EmailInput
            id="login-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            onKeyDown={handleInputKeyDown}
          />
          {emailError && (
            <p style={{ color: "#f97373", fontSize: 11, marginTop: 4 }}>
              {emailError}
            </p>
          )}
        </div>

        <PrimaryButton type="button" onClick={handleContinue}>
          Continue
        </PrimaryButton>

        <FinePrint>
          By continuing, you agree to our{" "}
          <a href="/SMSTerms/" target="_blank" rel="noreferrer">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy-policy/" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </FinePrint>
      </Dialog>
    </Backdrop>
  );
}

export default LoginModal;
