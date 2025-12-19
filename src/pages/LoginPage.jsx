// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Footer from "../components/Footer";
import { signIn } from "../lib/firebase";
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

const ForgotPasswordLink = styled.a`
  display: inline-block;
  margin-top: 6px;
  margin-bottom: 18px;
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
  font-size: 11px;
  color: #6b7280;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e5e7eb;
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

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginFailed, setLoginFailed] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginFailed(false);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const isSuccess = await signIn(email, password);
      if (isSuccess) {
        navigate("/ai/library");
      } else {
        setLoginFailed(true);
      }
    } catch (error) {
      setLoginFailed(true);
    }
  };

  return (
    <>
      <Page>
        <BrandBar>Vetcation</BrandBar>

        <Main>
          <Card>
            {loginFailed && (
              <ErrorBanner>Invalid email or password.</ErrorBanner>
            )}

            <Title>Enter your password</Title>

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
              {/* 
              <ForgotPasswordLink href="/forgot-password">
                Forgot password?
              </ForgotPasswordLink> */}

              <PrimaryButton type="submit">Continue</PrimaryButton>
            </form>

            {/* <DividerRow>
              <DividerLine />
              <span>OR</span>
              <DividerLine />
            </DividerRow>

            <SecondaryButton type="button">
              Log in with a one-time code
            </SecondaryButton> */}
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

export default LoginPage;
