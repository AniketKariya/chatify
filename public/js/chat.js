const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("#message-box");
const $messageFormButton = document.querySelector("#send-message");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
    "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options

const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h: mm a"),
    });
    console.log(html);
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
});

socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessageError", (message) => {
    const html = Mustache.render(messageTemplate, {
        message,
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("room-update", ({ room, users }) => {
    console.log(users);
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    });
    document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.message.value;
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if (error) {
            return console.log(error);
        }

        console.log("message delivered");
    });
});

$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("geolocation is not supported by your browser.");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");
    navigator.geolocation.getCurrentPosition(
        (position) => {
            socket.emit(
                "send-location",
                {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                () => {
                    console.log("location shared.");
                    $sendLocationButton.removeAttribute("disabled");
                }
            );
        },
        (error) => {
            socket.emit("send-location-error", () => {
                $sendLocationButton.removeAttribute("disabled");
            });
        },
        {
            timeout: 10000,
        }
    );

    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
});

const fetchUserInfo = async () => {
    const response = await fetch("/users/me");
    const json = await response.json();

    const username = json.name;

    document.getElementById("username").innerHTML = username;
    document.getElementById("email").innerHTML = json.email;

    socket.emit("join", { username, room: "global" }, (error) => {
        // if (error) {
        //     alert(error);
        //     location.href = "/";
        // }
    });
};
fetchUserInfo();
const btn_createRoom = document.getElementById("create-room");
const btn_joinRoom = document.getElementById("join-room");
const btn_createConf = document.getElementById("create-conf");
const btn_joinConf = document.getElementById("join-conf");
const btn_logout = document.getElementById("logout");
const btn_speak = document.getElementById("speak");
const btn_deleteAccount = document.getElementById("delete-account");

const createOrJoinConf = (mode, id) => {
    if (id !== null) {
        if (isNaN(id) || id == "") {
            return alert("only numeric id is allowed.");
        }
        url = "./video-conferencing.html?q=" + mode + "&id=" + id;
        window.open(url);
    }
};

btn_createRoom.addEventListener("click", () => {
    alert("yet to be completed");
});
btn_joinRoom.addEventListener("click", () => {
    alert("yet to be completed");
});

btn_createConf.addEventListener("click", () => {
    id = prompt(
        "Enter unique conference ID (numeric).\nConference IDs can be used to join conference."
    );
    createOrJoinConf("create", id);
});

btn_joinConf.addEventListener("click", () => {
    id = prompt("Enter conference ID to be joined: ");
    createOrJoinConf("join", id);
});

btn_logout.addEventListener("click", () => {
    window.location = "/logout";
});

btn_speak.addEventListener("click", () => {
    alert("yet to be completed");
});

btn_deleteAccount.addEventListener("click", () => {
    location.href = "/users/me/delete";
})