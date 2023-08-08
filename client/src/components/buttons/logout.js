import React from "react";
import { IoExitOutline } from "react-icons/io5";
import { Button } from "@mantine/core";

export const Logout = () => {
  const handleLogout = async () => {
    await fetch("http://localhost:3000/user/logout", {
      method: "DELETE",
      credentials: "include",
    });

    window.location.reload(false);
  };

  return (
    <Button onClick={handleLogout} leftIcon={<IoExitOutline />} color="dark">
      Log out
    </Button>
  );
  // return <button onClick={handleLogout}>Logout</button>;
};
