import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { TripProvider } from "./contexts/TripContext";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <TripProvider>
          <App />
        </TripProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
