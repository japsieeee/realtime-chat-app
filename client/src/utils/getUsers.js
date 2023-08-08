export const getUsers = async () => {
  let users = null;

  const response = await fetch("http://localhost:3000/user", {
    credentials: "include",
  });

  const { data, error } = await response.json();

  if (!error && data.length >= 1) {
    users = data;
  } else {
    users = null;
  }

  return users;
};
