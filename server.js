const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const colors = require("colors");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Benion Chat Bot";

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Listens When A Client Connects
io.on("connection", (socket) => {
    console.log("New Web Socket Connection...".blue);

    // Listen For Join Room
    socket.on("joinRoom", ({ username, room }) => {

        // Join Room
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome Current User
        socket.emit("message", formatMessage(botName, "Welcome To Benion ChatChord..!!"));

        // Broadcast When A User Connects
        socket.broadcast.to(user.room).emit("message", formatMessage(botName,  `${ user.username } Just Joined The Chat`));

        // Send Users And Room Info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    
    // Listen For Chat Message
    socket.on("chatMessage", (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, message));
    });

    // Display When A User Disconnects
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit("message", formatMessage(botName, `${ user.username } Just Left The Chat`));

            // Send Users And Room Info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 8828;
server.listen(PORT, () => console.log(`Benion Server Started On Port ${PORT}`.yellow));