export const reverseChannelID = (channelID) =>
  channelID ? `${channelID.split("-")[1]}-${channelID.split("-")[0]}` : "";
