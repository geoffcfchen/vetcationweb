import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Container,
  Row,
  Col,
  Form,
  Button as BootstrapButton,
  Alert,
} from "react-bootstrap";
import Footer from "../components/Footer";
import { signIn } from "../lib/firebase";

// Styled components
const StyledLoginPage = styled.div`
  background-color: #f0f2f5;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 765px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const FixedSection = styled.div`
  width: 400px; /* Set fixed width */
  @media (max-width: 765px) {
    width: 100%; /* For mobile view, allow full width */
    text-align: center;
  }
`;

const FacebookText = styled.div`
  font-family: "Helvetica Neue", sans-serif;
  font-size: 36px;
  font-weight: bold;
  color: #1877f2;
  margin-bottom: 10px;
`;

const FacebookTagline = styled.div`
  font-size: 20px;
  color: #1c1e21;
  margin-top: 10px;
`;

const InputField = styled(Form.Control)`
  border-radius: 5px;
  font-size: 17px;
  padding: 14px;
  width: 100%; /* Ensure the input field takes up the entire container */
`;

const PrimaryButton = styled(BootstrapButton).attrs({
  variant: "primary",
})`
  background-color: #1877f2;
  border-color: #1877f2;
  font-size: 20px;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: #166fe5;
    border-color: #166fe5;
  }
`;

const SuccessButton = styled(BootstrapButton).attrs({
  variant: "success",
})`
  background-color: #42b72a;
  border-color: #42b72a;
  font-size: 17px;
  padding: 10px 20px;
  border-radius: 6px;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: #36a420;
    border-color: #36a420;
  }
`;

const LinkText = styled.a`
  color: #1877f2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.hr`
  margin-top: 30px;
  margin-bottom: 20px;
  border-top: 1px solid #dadde1;
`;

const SmallText = styled.div`
  color: #65676b;
  font-size: 14px;
  text-align: center;
  margin-top: 1rem;
`;

const LoginSection = styled.div`
  display: grid;
  grid-template-columns: 400px 400px; /* Fixed widths for both left and right parts */
  gap: 50px;
  align-items: center;

  @media (max-width: 765px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginFailed, setLoginFailed] = useState(false);
  const navigate = useNavigate();

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

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const isSuccess = await signIn(email, password);
      if (isSuccess) {
        navigate("/ai/library"); // Only navigate if sign-in is successful
      } else {
        setLoginFailed(true); // Set login failed to true if sign-in failed
      }
    } catch (error) {
      setLoginFailed(true); // Handle unexpected errors
    }
  };

  return (
    <>
      <StyledLoginPage>
        <LoginSection>
          {/* Left side with Vetcation Text */}
          <FixedSection>
            <div className="text-center">
              <FacebookText>Vetcation</FacebookText>
              <FacebookTagline>
                Ask, connect, and learn from a community of licensed veterinary
                experts on Vetcation.
              </FacebookTagline>
            </div>
          </FixedSection>

          {/* Right side with Login Form */}
          <FixedSection>
            {loginFailed && (
              <Alert variant="danger">Invalid email or password.</Alert>
            )}
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label className="sr-only">Email</Form.Label>
                <InputField
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: null });
                  }}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formPassword" className="mt-3">
                <Form.Label className="sr-only">Password</Form.Label>
                <InputField
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: null });
                  }}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <PrimaryButton type="submit">Log In</PrimaryButton>
            </Form>

            <div className="text-center mt-3">
              <LinkText href="/forgot-password">Forgot password?</LinkText>
            </div>

            <Divider />

            <div className="text-center">
              <SuccessButton href="/register">Create new account</SuccessButton>
            </div>

            <SmallText>
              <LinkText href="/create-page">Create a Page</LinkText> for a
              celebrity, brand or business.
            </SmallText>
          </FixedSection>
        </LoginSection>
      </StyledLoginPage>
      <Footer />
    </>
  );
}

export default LoginPage;
