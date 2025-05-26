import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              color: "white",
              background: "#111",
            },
          },
          error: {
            style: {
              color: "white",
              background: "#111",
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
