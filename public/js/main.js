const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const socket = io();


// Get Username And Room From The URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join Room
socket.emit("joinRoom", { username, room });

// Get Room Users And Room Info
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Get And Display Messages From The Server
socket.on("message", (message) => {
    outputMessage(message);

    // Set New Message Scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit Chat Form
chatForm.addEventListener("submit", (event) => {

    // Prevent Default Submission
    event.preventDefault();
    
    // Get Text Inputs
    const message = event.target.elements.message.value;

    // Emit To The Server
    socket.emit("chatMessage", message);

    // Clear Input
    event.target.elements.message.value = "";
    event.target.elements.message.focus();
});

// Output Message To The DOM
outputMessage = (message) => {
    const div = document.createElement("div");
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${ message.username } <span>${ message.time }</span></p>
    <p class="text">
        ${ message.text }
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
};

// Add Room Name To DOM
outputRoomName = (room) => {
    roomName.innerText = room;
};

// Add Users To DOM
outputUsers = (users) => {
    userList.innerHTML = `${ users.map(user => `<li>${ user.username }</li>` ).join("") }`;
};