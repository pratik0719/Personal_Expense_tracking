import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Self-hosted fonts (work offline, no third-party requests).
import "@fontsource-variable/manrope";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import App from "./App.jsx";
import { BrandProvider } from "./context/BrandContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BrandProvider>
        <App />
      </BrandProvider>
    </BrowserRouter>
  </StrictMode>
);
