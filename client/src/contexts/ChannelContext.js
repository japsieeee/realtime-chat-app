import { createContext, useState } from "react";

export const ChannelContext = createContext(null);

export const ChannelContextProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [notifs, setNotifs] = useState([]);

  return (
    <ChannelContext.Provider
      value={{ activeUsers, setActiveUsers, notifs, setNotifs }}
    >
      {children}
    </ChannelContext.Provider>
  );
};
