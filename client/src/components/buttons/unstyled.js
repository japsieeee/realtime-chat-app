import React from "react";
import {
  Avatar,
  Box,
  Group,
  Indicator,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { ChannelContext } from "../../contexts/ChannelContext";
import { socket } from "../../utils/socket";
import { useNavigate, useParams } from "react-router-dom";
import { reverseChannelID } from "../../utils/helpers";

export const CNB = ({ payload, userID }) => {
  const navigate = useNavigate();
  const { channelID: cid } = useParams();
  const { activeUsers, notifs } = React.useContext(ChannelContext);
  const [allNotifications, setAllNotifications] = React.useState([]);

  const { _id, email } = payload;
  const thisRoom = `${userID}-${_id}`;
  const rcid = reverseChannelID(cid);

  const handleChangeID = () => {
    setAllNotifications([]);
    socket.emit("join-room", thisRoom);
    navigate(`/${userID}-${_id}`);
  };

  const initials = email.slice(0, 2);
  const name = email.split("@")[0];

  const { hovered, ref } = useHover();

  React.useEffect(() => {
    setAllNotifications([]);

    if (notifs.length >= 1) {
      const filtered = notifs.filter((n) => {
        const { channelID } = n;
        const reverseID = reverseChannelID(thisRoom);

        return channelID === thisRoom || channelID === reverseID;
      });

      setAllNotifications(filtered);
    }
  }, [notifs, thisRoom]);

  return (
    <UnstyledButton
      bg={
        hovered
          ? "#F1F3F5"
          : cid === `${userID}-${_id}` || rcid === `${userID}-${_id}`
          ? "dark"
          : "transparent"
      }
      w="100%"
      p="xs"
      ref={ref}
      onClick={handleChangeID}
    >
      <Group pos="relative" w="100%">
        <Indicator color={activeUsers.includes(_id) ? "green" : "gray"}>
          <Avatar size={40} color="dark">
            <Text tt="uppercase" span>
              {initials}
            </Text>
          </Avatar>
        </Indicator>
        <Box>
          <Text
            size="sm"
            tt="uppercase"
            color={
              (cid === `${userID}-${_id}` || rcid === `${userID}-${_id}`) &&
              !hovered
                ? "white"
                : "dark"
            }
          >
            {name}
          </Text>
          <Text size="xs" color="dimmed">
            {email}
          </Text>
        </Box>
        <Paper
          radius="sm"
          bg={allNotifications.length >= 1 ? "blue" : "white"}
          right={0}
          pos="absolute"
          p="xs"
        >
          <Text
            color={allNotifications.length >= 1 ? "white" : "dark"}
            span
            m={0}
          >
            {allNotifications.length}
          </Text>
        </Paper>
      </Group>
    </UnstyledButton>
  );
};

export const ContactNameButton = React.memo(CNB);
