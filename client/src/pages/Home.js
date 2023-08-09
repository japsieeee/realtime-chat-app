import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Flex, Paper, Text, Textarea } from "@mantine/core";
import { Sidebar } from "../layout/sidebar";
import { socket } from "../utils/socket";
import { AuthContext } from "../contexts/AuthContext";
import { getUserMessages } from "../utils/getUserMessages";
import { getMessageTime } from "../utils/getMessageTime";
import { useParams } from "react-router-dom";
import { reverseChannelID } from "../utils/helpers";

export const Home = () => {
  const { channelID: cid } = useParams();

  const { user } = useContext(AuthContext);

  const endRef = useRef();

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

    if (cid) {
      // fetch the old messages
      getUserMessages(cid)
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
    }
  }, [cid]);

  useEffect(() => {
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

          endRef?.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      });
    }

    return () => socket.off("receive-message");
  }, [cid]);

  // typing message

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
                        maw={400}
                        ta="start"
                      >
                        <Text size="xs" tt="uppercase" weight={600}>
                          {getMessageTime(createdAt)}
                        </Text>
                        <pre style={{ margin: 0 }}>
                          <Text color="dark" lh="20px">
                            {msg}
                          </Text>
                        </pre>
                      </Paper>
                    </Flex>
                  ))
                ) : (
                  <Text tt="uppercase" p="xs" weight={600} color="#FFFFFF">
                    Say hi! Make a conversation
                  </Text>
                )}
                <Box ref={endRef} mb="sm" />
              </Flex>
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
