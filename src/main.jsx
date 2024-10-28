import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import ContextWrapper from "./context/ContextWrapper.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </Router>
  </React.StrictMode>
);
