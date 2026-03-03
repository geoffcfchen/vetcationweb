import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "./LoginModal";

export default function SiteShell({ children }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Header onLoginClick={() => setShowLogin(true)} />
      {children}
      <Footer />
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
