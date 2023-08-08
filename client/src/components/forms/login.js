import React from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Button, Flex, Input, PasswordInput, Space } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MdAlternateEmail, MdPassword } from "react-icons/md";

export const LoginForm = () => {
  const { setUser } = React.useContext(AuthContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      notifications.show({
        title: "Incomplete Credentials",
        message: "Fill in email and password fields",
        color: "red",
      });

      return;
    }

    try {
      setLoading(true);

      const result = await fetch("http://localhost:3000/user/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });
      const { error, user } = await result.json();

      if (!error) {
        setUser(user);
        window.location.reload(false);
      } else {
        notifications.show({
          title: "Invalid Credentials",
          message: "Incorrect username or password",
          color: "red",
        });
      }

      setLoading(false);
    } catch (error) {
      notifications.show({
        title: "Internal Server Error",
        message: "Please try again in a few minutes",
        color: "orange",
      });
      setUser(null);
      setLoading(false);
    }
  };

  const handleUsername = (event) => setUsername(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  return (
    <Flex direction="column">
      <Flex p="lg" direction="column" w="400px" mx="auto">
        <Input
          width="400px"
          onChange={handleUsername}
          icon={<MdAlternateEmail />}
          placeholder="Your email"
          disabled={loading}
        />

        <Space my="xs" />

        <PasswordInput
          width="400px"
          onChange={handlePassword}
          icon={<MdPassword />}
          placeholder="Your password"
          disabled={loading}
        />

        <Space my="xs" />

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          Log in
        </Button>
      </Flex>
    </Flex>
  );
};
