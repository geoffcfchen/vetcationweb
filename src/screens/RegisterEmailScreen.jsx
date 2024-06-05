import React, { useState } from "react";
import { Modal, Form, Button, Col, Row, Container } from "react-bootstrap";
import styled from "styled-components";
import { useFormik } from "formik";
import * as Yup from "yup";

// Styled components
const StyledContainer = styled(Container)`
  padding: 2rem;
`;

const StyledRow = styled(Row)`
  margin-bottom: 1rem;
`;

const StyledLinkText = styled.span`
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #000;
  }

  &::before {
    margin-right: 0.25em;
  }

  &::after {
    margin-left: 0.25em;
  }
`;

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export default function RegisterEmailScreen() {
  const [showModal, setShowModal] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "", passwordConfirmation: "" },
    validationSchema,
    onSubmit: (values) => {
      alert("Registration Successful!");
      console.log(values);
    },
  });

  return (
    <StyledContainer>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group as={StyledRow} controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              isInvalid={!!formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={StyledRow} controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              isInvalid={!!formik.errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group
          as={StyledRow}
          controlId="formPlaintextPasswordConfirmation"
        >
          <Form.Label column sm="2">
            Confirm Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirmation}
              isInvalid={!!formik.errors.passwordConfirmation}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.passwordConfirmation}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>

      <Divider>or</Divider>

      {/* Placeholder for third-party authentication */}
      <Button variant="secondary">Sign Up with Google</Button>
      <Button variant="dark">Sign Up with Apple</Button>

      <StyledLinkText onClick={() => setShowModal(true)}>
        Terms & Conditions
      </StyledLinkText>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Placeholder for your terms and conditions */}
          Please read the terms and conditions carefully.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledContainer>
  );
}
