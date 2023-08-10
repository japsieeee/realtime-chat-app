import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Flex, Paper, Text, Textarea } from "@mantine/core";
import { Sidebar } from "../layout/sidebar";
import { socket } from "../utils/socket";
import { AuthContext } from "../contexts/AuthContext";
import { getUserMessages } from "../utils/getUserMessages";
import { getMessageTime } from "../utils/getMessageTime";
import { useParams } from "react-router-dom";
import { reverseChannelID } from "../utils/helpers";
import { notifications } from "@mantine/notifications";
import { ChannelContext } from "../contexts/ChannelContext";

export const Home = () => {
  const { channelID: cid } = useParams();

  const { user } = useContext(AuthContext);
  const { setNotifs } = useContext(ChannelContext);

  const contentRef = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // if someone is typing
  const [typing, setTyping] = useState(false);

  const handleMessage = (event) => setMessage(event.target.value);

  const handleSend = () => {
    const splitChannelID = cid.split("-");
    const to = splitChannelID.find((id) => id !== user._id);

    const msg = {
      message,
      channelID: cid,
      from: user._id,
      to,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send-message", msg);
    setMessage("");
  };

  useEffect(() => {
    setMessages([]);
    setMessage("");

    if (cid) {
      // fetch the old messages
      getUserMessages(cid)
        .then((d) => {
          if (d) {
            setMessages(d);
          } else {
            setMessages([]);
          }
        })
        .catch((error) => {
          console.log(error);
          setMessages([]);
        });
    }
  }, [cid]);

  useEffect(() => {
    socket.on("receive-notification", (payload) => {
      const {
        from: { email },
        channelID,
        message,
        to,
      } = payload;

      const reverseID = reverseChannelID(channelID);

      if (cid === channelID || cid === reverseID) {
      } else {
        if (user._id === to) {
          setNotifs((prev) => [...prev, payload]);

          notifications.show({
            title: (
              <Text color="dark" span>
                {`New message from: ${email}`}
              </Text>
            ),
            message:
              message.length >= 20 ? `${message.slice(0, 20)}...` : message,
            color: "blue",
          });
        }
      }
    });

    if (cid) {
      socket.on("receive-message", (payload) => {
        const payloadWithTime = {
          ...payload,
          createdAt: new Date().toISOString(),
        };

        // you can see it everywhere, it just basically reversed the channel id to check if it matches
        const reverseID = reverseChannelID(cid);

        if (
          payloadWithTime.channelID === cid ||
          payloadWithTime.channelID === reverseID
        ) {
          setMessages((prev) => [...prev, payloadWithTime]);
        }
      });
    }

    socket.on("receive-is-typing", (payload) => {
      const { channelID, from, typing: isTyping } = payload;
      const reverseID = reverseChannelID(channelID);

      if (cid === channelID || cid === reverseID) {
        if (from !== user._id) {
          if (isTyping) {
            setTyping(true);
          } else {
            setTyping(false);
          }
        }
      }
    });

    return () => {
      socket.off("receive-is-typing");
      socket.off("receive-message");
      socket.off("receive-notification");
    };
    // eslint-disable-next-line
  }, [cid, user._id]);

  useEffect(() => {
    const payload = {
      channelID: cid,
      from: user._id,
    };

    if (message.length >= 1) {
      socket.emit("is-typing", { ...payload, typing: true });
    } else {
      socket.emit("is-typing", { ...payload, typing: false });
    }
  }, [message, cid, user._id]);

  useEffect(() => {
    contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [messages]);

  return (
    <Flex mih="100vh">
      <Sidebar />

      <Flex direction="column" justify="space-between" w="100%">
        <Flex justify="space-between" align="start" w="100%" p="sm">
          <Flex direction="column" w="100%" align="center" pos="relative">
            <Text lh="22px" mb="lg">
              <Badge color="dark" size="lg" radius="xs">
                Convo ID: {cid || "Select Conversation"}
              </Badge>
            </Text>

            <Flex
              w="100%"
              direction="column"
              mah="500px"
              bg="dark"
              mb="sm"
              px="sm"
              ref={contentRef}
              style={{
                overflowY: "auto",
              }}
            >
              <Flex h="100%" direction="column" justify="start">
                <Paper pos="absolute" bg="transparent" w="100%">
                  {typing && (
                    <Paper bg="#E7F5FF" radius="xl" w="200px" mx="auto" mt="sm">
                      <Text ta="center" color="dark">
                        He is typing...
                      </Text>
                    </Paper>
                  )}
                </Paper>
                {cid && messages.length >= 1 ? (
                  messages.map(({ from, createdAt, message: msg }, i) => (
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
                        ta="start"
                      >
                        <Text size="xs" tt="uppercase" weight={600}>
                          {getMessageTime(createdAt)}
                        </Text>
                        <Box maw="500px" style={{ whiteSpace: "pre-wrap" }}>
                          {msg}
                        </Box>
                      </Paper>
                    </Flex>
                  ))
                ) : (
                  <Text tt="uppercase" p="xs" weight={600} color="#FFFFFF">
                    Say hi! Make a conversation
                  </Text>
                )}
              </Flex>
              <Box mt="xs" />
            </Flex>

            {cid && (
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
