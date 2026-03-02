import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

export default function RequireAuth({ user, isLoading }) {
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      const target = `${location.pathname}${location.search || ""}`;
      sessionStorage.setItem("postAuthRedirectPath", target);
    }
  }, [isLoading, user, location.pathname, location.search]);

  // KEY CHANGE:
  // Only show the full-page loading screen if we have no user yet.
  if (isLoading && !user) {
    return (
      <FullPage>
        <Spinner />
        <Hint>Loading...</Hint>
      </FullPage>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const FullPage = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Spinner = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 2px solid #e5e7eb;
  border-top-color: #0ea5e9;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Hint = styled.div`
  font-size: 13px;
  color: #6b7280;
`;
