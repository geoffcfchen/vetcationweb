// src/components/GoogleSignInButton.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../lib/firebase";

const Button = styled.button`
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 10px 16px;
  background: #ffffff;
  color: #111827;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease,
    transform 120ms ease;
  min-width: 220px;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
    border-color: #cbd5e1;
    transform: translateY(-0.5px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export default function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleClick() {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      if (!user) {
        // user closed popup or something non fatal
        return;
      }

      // At this point Google showed the account chooser screen.
      // User picked an account and Firebase signed them in.
      navigate("/ai/library");
    } catch (error) {
      // already logged and optionally alerted in signInWithGoogle
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" onClick={handleClick} disabled={loading}>
      <FcGoogle size={20} />
      <span>{loading ? "Signing in..." : "Continue with Google"}</span>
    </Button>
  );
}
