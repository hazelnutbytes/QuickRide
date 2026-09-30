import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api, { setToken } from "./api";
import Auth from "./components/Auth";
import RiderDashboard from "./components/RiderDashboard";
import DriverDashboard from "./components/DriverDashboard";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

function App() {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState("");
  const [message, setMessage] = useState("");
  const [socketStatus, setSocketStatus] = useState("Disconnected");
  const [liveLocation, setLiveLocation] = useState(null);

  const showMessage = (text) => setMessage(text);

  const handleError = (error) => {
    showMessage(
      error.response?.data?.message || error.message || "Request failed"
    );
  };

  const login = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      const newToken = response.data.token;
      setTokenState(newToken);
      setToken(newToken);
      setUser(response.data.user);
      showMessage(`Logged in as ${response.data.user.name}`);
    } catch (error) {
      handleError(error);
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      const newToken = response.data.token;
      setTokenState(newToken);
      setToken(newToken);
      setUser(response.data.user);
      showMessage("Registration successful");
    } catch (error) {
      handleError(error);
    }
  };

  const logout = () => {
    window.quickRideSocket?.disconnect();
    setToken("");
    setTokenState("");
    setUser(null);
    setSocketStatus("Disconnected");
    setLiveLocation(null);
    showMessage("Logged out");
  };

  const connectSocket = () => {
    window.quickRideSocket?.disconnect();
    const socket = io(SOCKET_URL);
    window.quickRideSocket = socket;

    socket.on("connect", () => {
      setSocketStatus("Connected");
      showMessage("Socket.io connected");
    });

    socket.on("driverLocation", (data) => {
      setLiveLocation(data);
    });

    socket.on("disconnect", () => {
      setSocketStatus("Disconnected");
    });
  };

  const sendSocketLocation = (driverId) => {
    if (!window.quickRideSocket?.connected) {
      showMessage("Connect Socket.io first");
      return;
    }

    window.quickRideSocket.emit("driverLocation", {
      driverId: driverId || "test-driver",
      latitude: 19.055,
      longitude: 73.075
    });

    showMessage("Driver location sent through Socket.io");
  };

  useEffect(() => {
    return () => window.quickRideSocket?.disconnect();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="label">QUICKRIDE</p>
          <h1>Ride Sharing Backend</h1>
          <p className="muted">Simple frontend for testing the QuickRide API.</p>
        </div>

        <div className="header-status">
          <span className={token ? "badge active" : "badge"}>
            {token ? `${user?.role || "User"}` : "Not logged in"}
          </span>
          {token && <button className="small" onClick={logout}>Logout</button>}
        </div>
      </header>

      <main>
        {!user ? (
          <Auth onLogin={login} onRegister={register} />
        ) : user.role === "rider" ? (
          <RiderDashboard
            api={api}
            onError={handleError}
            showMessage={showMessage}
            connectSocket={connectSocket}
            socketStatus={socketStatus}
            liveLocation={liveLocation}
          />
        ) : (
          <DriverDashboard
            api={api}
            onError={handleError}
            showMessage={showMessage}
            connectSocket={connectSocket}
            socketStatus={socketStatus}
            sendSocketLocation={sendSocketLocation}
          />
        )}
      </main>

      {message && <div className="message">{message}</div>}
      <footer>QuickRide API • React + Express + MongoDB + Socket.io</footer>
    </div>
  );
}

export default App;
