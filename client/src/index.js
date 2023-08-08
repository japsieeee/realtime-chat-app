import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ChannelContextProvider } from "./contexts/ChannelContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthContextProvider>
        <ChannelContextProvider>
          <Notifications />
          <App />
        </ChannelContextProvider>
      </AuthContextProvider>
    </MantineProvider>
  </React.StrictMode>
);
