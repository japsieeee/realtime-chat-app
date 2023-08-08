import React from "react";
import { Button, Flex, Input, PasswordInput, Space } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { MdAlternateEmail, MdPassword } from "react-icons/md";

export const SignupForm = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      notifications.show({
        title: "Incomplete Credentials",
        message: "Fill in username and password fields",
        color: "red",
      });

      return;
    }

    try {
      setLoading(true);

      const result = await fetch("http://localhost:3000/user/signup", {
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

      const { error } = await result.json();

      if (!error) {
        notifications.show({
          title: "Sign up success",
          message: "You can now login to your account",
          color: "green",
        });

        setUsername("");
        setPassword("");
      } else {
        notifications.show({
          title: "Email already exist",
          message: "Email already exist. Please use another email",
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
          Sign up
        </Button>
      </Flex>
    </Flex>
  );
};
