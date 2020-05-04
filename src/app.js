require("./db/mongoose");
// const hbs = require("hbs");
const path = require("path");
const http = require("http");
const express = require("express");
const Filter = require("bad-words");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const session = require("express-session");
const userRouter = require("./routers/user");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
    generateMessage,
    generateLocationMessage,
} = require("./utils/messages");
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require("./utils/users");

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
// const viewsPath = path.join(__dirname, "../templates/views");
// const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
// app.set("view engine", "hbs");
// app.set("views", viewsPath);
// hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET }));

app.io = io;

// for maintenance use
// app.use((req, res, next) => {
// 	res.status(503).send("Service temporarily unavailable")
// });

app.use(express.json());
app.use(userRouter);

io.on("connection", (socket) => {
    console.log("New connection");
    console.log(socket.id);

    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit("message", generateMessage("Chatify", "welcome!"));
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                generateMessage("Chatify", `${user.username} has joined`)
            );
        io.to(user.room).emit("room-update", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("profanity is not allowed");
        }

        io.to(user.room).emit(
            "message",
            generateMessage(user.username, message)
        );
        callback();
    });

    socket.on("send-location", (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit(
            "locationMessage",
            generateLocationMessage(
                user.username,
                `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
            )
        );
        callback();
    });

    socket.on("send-location-error", (callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit(
            "locationMessageError",
            "Something went wrong sharing location."
        );
        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                generateMessage("Chatify", `${user.username} has left`)
            );
            io.to(user.room).emit("room-update", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

module.exports = server;
