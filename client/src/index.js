import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContext";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ChannelContextProvider } from "./contexts/ChannelContext";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AuthContextProvider>
          <ChannelContextProvider>
            <Notifications />
            <App />
          </ChannelContextProvider>
        </AuthContextProvider>
      </MantineProvider>
    ),
    children: [
      {
        path: ":channelID",
        element: <Outlet />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
