import React from "react";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { ChannelContext } from "../../contexts/ChannelContext";

export const ContactNameButton = ({ payload, userID }) => {
  const { channelID, setChannelID } = React.useContext(ChannelContext);

  const { _id, email } = payload;

  const handleChangeID = () => setChannelID(`${userID}-${_id}`);

  const initials = email.slice(0, 2);
  const name = email.split("@")[0];

  const { hovered, ref } = useHover();

  return (
    <UnstyledButton
      bg={
        hovered
          ? "#F1F3F5"
          : channelID === `${userID}-${_id}`
          ? "dark"
          : "transparent"
      }
      w="100%"
      p="xs"
      ref={ref}
      onClick={handleChangeID}
    >
      <Group>
        <Avatar size={40} color="dark">
          <Text tt="uppercase" span>
            {initials}
          </Text>
        </Avatar>
        <div>
          <Text
            size="sm"
            tt="uppercase"
            color={
              channelID === `${userID}-${_id}` && !hovered ? "white" : "dark"
            }
          >
            {name}
          </Text>
          <Text size="xs" color="dimmed">
            {email}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
};
