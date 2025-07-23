import React from "react";
import ReactDOM from "react-dom/client";
import "./styles-index.css";
import Experience from "./Experience";

/**
 * Renders the root React component into the DOM.
 * @function renderApp
 * @param {HTMLElement} rootElement - The root HTML element to render the application into.
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Experience />
  </React.StrictMode>
);
