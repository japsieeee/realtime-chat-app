import React from "react";
import { LoginForm } from "../components/forms/login";
import { Flex, Paper, SegmentedControl, Space } from "@mantine/core";
import { SignupForm } from "../components/forms/signup";

export const Landing = () => {
  const [page, setPage] = React.useState("login");

  const handleChange = (value) => setPage(value);

  return (
    <Flex direction="column" justify="center">
      <Space mt="xl" />
      <Paper maw="500px" mx="auto">
        <SegmentedControl
          data={[
            { label: "Login", value: "login" },
            { label: "Signup", value: "signup" },
          ]}
          onChange={handleChange}
        />
      </Paper>

      {page === "login" && <LoginForm />}
      {page === "signup" && <SignupForm />}
    </Flex>
  );
};
