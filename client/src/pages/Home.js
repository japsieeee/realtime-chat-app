import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Flex, Paper, Text, Textarea } from "@mantine/core";
import { Sidebar } from "../layout/sidebar";
import { socket } from "../utils/socket";
import { ChannelContext } from "../contexts/ChannelContext";
import { AuthContext } from "../contexts/AuthContext";
import { getUserMessages } from "../utils/getUserMessages";

export const Home = () => {
  const { channelID } = useContext(ChannelContext);
  const { user } = useContext(AuthContext);

  const endRef = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [once, setOnce] = useState(false);

  const handleMessage = (event) => setMessage(event.target.value);

  const handleSend = () => {
    const splitChannelID = channelID.split("-");
    const to = splitChannelID.find((id) => id !== user._id);

    const msg = {
      message,
      channelID,
      from: user._id,
      to,
    };

    socket.emit("send-message", msg);
    setMessage("");
  };

  useEffect(() => {
    if (channelID) {
      // fetch the old messages
      getUserMessages(channelID)
        .then((d) => {
          if (d) {
            endRef?.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
            setMessages(d);
          } else {
            setMessages([]);
          }
        })
        .catch((error) => {
          console.log(error);
          setMessages([]);
        });

      // this once state prevents the socket listener to render twice
      if (!once) {
        setOnce(true);
        socket.emit("join-room", channelID);

        socket.on("receive-message", (payload) => {
          setMessages((prev) => [...prev, payload]);

          endRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        });
      }
    }
  }, [channelID, once]);

  return (
    <Flex mih="100vh">
      <Sidebar />

      <Flex direction="column" justify="space-between" w="100%">
        <Flex justify="space-between" align="start" w="100%" p="sm">
          <Flex direction="column" w="100%" align="center">
            <Text lh="22px" mb="lg">
              <Badge color="dark" size="lg" radius="xs">
                Convo ID: {channelID || "Select Conversation"}
              </Badge>
            </Text>

            <Flex
              w="100%"
              direction="column"
              mah="500px"
              bg="dark"
              mb="sm"
              px="sm"
              style={{
                overflowY: "auto",
              }}
            >
              <Flex h="100%" direction="column" justify="center">
                {channelID && messages.length >= 1 ? (
                  messages.map(({ from, to, message: msg }, i) => (
                    <Flex
                      key={i}
                      justify={from === user._id ? "end" : "start"}
                      mr="xs"
                      my="xs"
                    >
                      <Paper
                        bg={from === user._id ? "#FFFFFF" : "#A6A7AB"}
                        radius="sm"
                        p="xs"
                        maw={400}
                        ta="start"
                      >
                        <Text color="dar">{msg}</Text>
                      </Paper>
                    </Flex>
                  ))
                ) : (
                  <Text tt="uppercase" p="xs" weight={600} color="#FFFFFF">
                    Say hi! Make a conversation
                  </Text>
                )}
                <Box ref={endRef} />
              </Flex>
            </Flex>

            {channelID && (
              <>
                <Textarea w="100%" value={message} onChange={handleMessage} />
                <Button color="dark" onClick={handleSend} mt="sm">
                  Send Message
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
