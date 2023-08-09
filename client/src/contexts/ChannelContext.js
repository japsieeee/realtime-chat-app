import { createContext, useState } from "react";

export const ChannelContext = createContext(null);

export const ChannelContextProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState([]);

  return (
    <ChannelContext.Provider value={{ activeUsers, setActiveUsers }}>
      {children}
    </ChannelContext.Provider>
  );
};
