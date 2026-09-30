require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");

const connectDB =
    require("./src/config/db");

const authRoutes =
    require("./src/routes/authRoutes");

const rideRoutes =
    require("./src/routes/rideRoutes");

const driverRoutes =
    require("./src/routes/driverRoutes");

const fareRoutes =
    require("./src/routes/fareRoutes");

const app = express();

const server =
    http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "QuickRide API is running"
    });
});

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/rides",
    rideRoutes
);

app.use(
    "/api/drivers",
    driverRoutes
);

app.use(
    "/api/fares",
    fareRoutes
);

io.on("connection", (socket) => {
    console.log(
        "User connected:",
        socket.id
    );

    socket.on(
        "driverLocation",
        (data) => {
            io.emit(
                "driverLocation",
                data
            );
        }
    );

    socket.on(
        "disconnect",
        () => {
            console.log(
                "User disconnected:",
                socket.id
            );
        }
    );
});

const PORT =
    process.env.PORT || 4000;

server.listen(
    PORT,
    () => {
        console.log(
            `QuickRide server running on port ${PORT}`
        );
    }
);