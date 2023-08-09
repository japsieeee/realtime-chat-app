export const getUserInfo = async () => {
  const response = await fetch("http://localhost:3000/user/info", {
    credentials: "include",
  });

  const { data, error } = await response.json();

  let user = null;

  if (!error) {
    const { info } = data;

    if (info) {
      const details = {
        _id: info._id,
        email: info.email,
      };
      user = details;
    }
  } else {
    user = null;
  }

  return user;
};
