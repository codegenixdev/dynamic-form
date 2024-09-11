import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>
);
