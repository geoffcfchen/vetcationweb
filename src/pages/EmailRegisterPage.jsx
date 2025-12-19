// src/pages/EmailRegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Footer from "../components/Footer";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

const SuccessBanner = styled.div`
  margin-bottom: 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #dcfce7;
  color: #166534;
  font-size: 14px;
`;

const FieldBlock = styled.div`
  margin-bottom: 16px;
`;

const FieldLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
`;

const PillShell = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 10px 16px;
  font-size: 14px;
`;

const EmailText = styled.span`
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditEmailButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin-left: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const InputShell = styled.div`
  display: flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  padding: 10px 16px;
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #111827;

  ::placeholder {
    color: #9ca3af;
  }
`;

const IconButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin-left: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  font-size: 18px;
`;

const ErrorText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #b91c1c;
`;

const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 4px;
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

function EmailRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [errors, setErrors] = useState({});
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!password2) {
      newErrors.password2 = "Please confirm your password";
    } else if (password2 !== password) {
      newErrors.password2 = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        await sendEmailVerification(cred.user);
        setSignupSuccess(
          "Account created. A verification email has been sent. Please check your inbox."
        );
        // Optionally redirect them to /email-verification
        // navigate("/email-verification");
        // Or just let the global onAuthStateChanged listener handle it.
      }
    } catch (err) {
      console.error("Error creating account:", err);
      setSignupError(
        err.code === "auth/email-already-in-use"
          ? "This email is already in use. Try logging in instead."
          : "Could not create your account. Please try again."
      );
    }
  };

  return (
    <>
      <Page>
        <BrandBar>Vetcation</BrandBar>

        <Main>
          <Card>
            {signupError && <ErrorBanner>{signupError}</ErrorBanner>}
            {signupSuccess && <SuccessBanner>{signupSuccess}</SuccessBanner>}

            <Title>Create your password</Title>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email block */}
              <FieldBlock>
                <FieldLabel>Email address</FieldLabel>
                {isEditingEmail ? (
                  <>
                    <InputShell>
                      <TextInput
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors((prev) => ({ ...prev, email: null }));
                        }}
                      />
                    </InputShell>
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                  </>
                ) : (
                  <PillShell>
                    <EmailText title={email}>{email}</EmailText>
                    <EditEmailButton
                      type="button"
                      onClick={() => setIsEditingEmail(true)}
                    >
                      Edit
                    </EditEmailButton>
                  </PillShell>
                )}
              </FieldBlock>

              {/* Password block */}
              <FieldBlock>
                <FieldLabel>Password</FieldLabel>
                <InputShell>
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: null }));
                    }}
                  />
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputShell>
                {errors.password && <ErrorText>{errors.password}</ErrorText>}
              </FieldBlock>

              {/* Confirm password */}
              <FieldBlock>
                <FieldLabel>Confirm password</FieldLabel>
                <InputShell>
                  <TextInput
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Confirm password"
                    value={password2}
                    onChange={(e) => {
                      setPassword2(e.target.value);
                      setErrors((prev) => ({ ...prev, password2: null }));
                    }}
                  />
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword2((prev) => !prev)}
                    aria-label={
                      showPassword2
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showPassword2 ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputShell>
                {errors.password2 && <ErrorText>{errors.password2}</ErrorText>}
              </FieldBlock>

              <PrimaryButton type="submit">Create account</PrimaryButton>
            </form>
          </Card>
        </Main>

        <TermsRow>
          <TermsLink href="/terms">Terms of Use</TermsLink>
          <span>|</span>
          <TermsLink href="/privacy">Privacy Policy</TermsLink>
        </TermsRow>
      </Page>

      <Footer />
    </>
  );
}

export default EmailRegisterPage;
