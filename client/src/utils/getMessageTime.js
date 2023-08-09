export const getMessageTime = (messageDate) => {
  const dateString = new Date(messageDate).toDateString();
  const [, time] = messageDate.split("T");

  const [hours, minutes] = time.split(":");

  const t = `${hours}:${minutes}`;

  const [, m, d, y] = dateString.split(" ");

  return `${y} ${m} ${d} | ${t}` || "0000 Jan 00 00:00";
};
