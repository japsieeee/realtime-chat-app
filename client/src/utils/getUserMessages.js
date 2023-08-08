export const getUserMessages = async (channelID) => {
  let messages = null;

  try {
    const response = await fetch(`http://localhost:3000/message/${channelID}`, {
      credentials: "include",
    });

    const { data, error } = await response.json();

    if (!error) {
      messages = data;
    }
  } catch (error) {
    messages = null;
  }

  return messages;
};
