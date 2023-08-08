import { useContext, useEffect } from "react";
import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { socket } from "./utils/socket";
import { getUserInfo } from "./utils/getUserInfo";
import { Landing } from "./pages/Landing";

function App() {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const userInfo = await getUserInfo();

      if (userInfo) {
        socket.connect();
        setUser(userInfo);
      } else {
        setUser(null);
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
