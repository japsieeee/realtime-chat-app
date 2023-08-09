import React from "react";
import { Avatar, Group, Indicator, Text, UnstyledButton } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { ChannelContext } from "../../contexts/ChannelContext";
import { socket } from "../../utils/socket";
import { useNavigate, useParams } from "react-router-dom";

export const ContactNameButton = ({ payload, userID }) => {
  const navigate = useNavigate();
  const { channelID: cid } = useParams();

  const { activeUsers } = React.useContext(ChannelContext);

  const { _id, email } = payload;

  const handleChangeID = () => {
    socket.emit("join-room", `${userID}-${_id}`);
    navigate(`/${userID}-${_id}`);
  };

  const initials = email.slice(0, 2);
  const name = email.split("@")[0];

  const { hovered, ref } = useHover();

  return (
    <UnstyledButton
      bg={
        hovered
          ? "#F1F3F5"
          : cid === `${userID}-${_id}`
          ? "dark"
          : "transparent"
      }
      w="100%"
      p="xs"
      ref={ref}
      onClick={handleChangeID}
    >
      <Group>
        <Indicator color={activeUsers.includes(_id) ? "green" : "gray"}>
          <Avatar size={40} color="dark">
            <Text tt="uppercase" span>
              {initials}
            </Text>
          </Avatar>
        </Indicator>
        <div>
          <Text
            size="sm"
            tt="uppercase"
            color={cid === `${userID}-${_id}` && !hovered ? "white" : "dark"}
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
