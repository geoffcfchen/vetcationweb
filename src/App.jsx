import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Feature from "./components/Feature";
import FeaturesSection from "./components/FeaturesSection";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      {/* <HeroSection /> */}
      {/* <Feature
        icon="easy"
        heading="Super Easy to get advice"
        text="Look no further! Our platform provides a unique opportunity..."
        linkText="Learn More"
        linkHref="#"
      /> */}
      {/* <FeaturesSection /> // Use FeaturesSection here */}
      {/* More Features as needed */}
    </div>
  );
}

export default App;
