const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    socket.emit("driverLocation", {
        driverId: "6abc84343d4bf7d207aba5bd",
        latitude: 19.0473,
        longitude: 73.0699
    });
});

socket.on("driverLocation", (data) => {
    console.log("Received driver location:", data);
});

socket.on("disconnect", () => {
    console.log("Disconnected");
});