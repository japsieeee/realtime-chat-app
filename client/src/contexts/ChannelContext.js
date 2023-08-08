import { createContext, useState } from "react";

export const ChannelContext = createContext(null);

export const ChannelContextProvider = ({ children }) => {
  const [channelID, setChannelID] = useState("");

  return (
    <ChannelContext.Provider value={{ channelID, setChannelID }}>
      {children}
    </ChannelContext.Provider>
  );
};
