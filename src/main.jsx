import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UIProvider } from "./context/UIContext";
import { ShopProvider } from "./context/ShopContext";
import App from "./App";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/home.css";
import "./styles/pages.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UIProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </UIProvider>
    </BrowserRouter>
  </StrictMode>
);
