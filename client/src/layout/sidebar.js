import React from "react";
import { Flex, Paper, Text } from "@mantine/core";
import { getUserInfo } from "../utils/getUserInfo";
import { getUsers } from "../utils/getUsers";
import { Logout } from "../components/buttons/logout";
import { ContactNameButton } from "../components/buttons/unstyled";
import { socket } from "../utils/socket";
import { ChannelContext } from "../contexts/ChannelContext";
import { AuthContext } from "../contexts/AuthContext";

export const Sidebar = () => {
  const { user } = React.useContext(AuthContext);
  const { setActiveUsers } = React.useContext(ChannelContext);

  const [myID, setMyID] = React.useState("");
  const [allUsers, setAllUsers] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const users = await getUsers();
      setAllUsers(users);

      const data = await getUserInfo();
      setMyID(data._id);

      socket.emit("active-user", user);

      socket.on("get-active-users", (payload) => setActiveUsers(payload));
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <Flex
      direction="column"
      miw={320}
      justify="space-between"
      align="start"
      style={{
        borderRight: "1px solid lightgray",
      }}
    >
      <Flex align="start" direction="column" w="100%" p="sm">
        <Paper mb="xs">
          <Text weight={600} size="xl">
            Contacts
          </Text>
        </Paper>

        <Flex
          direction="column"
          w="100%"
          mah="80vh"
          style={{ overflowY: "auto" }}
        >
          {allUsers.length >= 1 &&
            allUsers
              .filter((user) => user._id !== myID)
              .map((user, i) => (
                <ContactNameButton key={i} payload={user} userID={myID} />
              ))}
        </Flex>
      </Flex>

      <Flex align="start" direction="column" w="100%" p="sm">
        <Logout />
      </Flex>
    </Flex>
  );
};
