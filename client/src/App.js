import { useContext, useEffect } from "react";
import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { socket } from "./utils/socket";
import { getUserInfo } from "./utils/getUserInfo";
import { Landing } from "./pages/Landing";
import { useParams } from "react-router-dom";

function App() {
  const { channelID: cid } = useParams();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await getUserInfo();

        if (userInfo) {
          socket.connect();

          if (cid) socket.emit("join-room", cid);

          setUser(userInfo);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      socket.disconnect();
    };

    // eslint-disable-next-line
  }, []);

  return <div className="App">{user ? <Home /> : <Landing />}</div>;
}

export default App;
