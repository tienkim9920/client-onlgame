import io from "socket.io-client";

var connectionOptions = {               
    "transports": ["websocket"]
};

// const socket = io.connect('http://localhost:4000', connectionOptions)
const socket = io.connect('https://server-onlgame.herokuapp.com', connectionOptions)

export default socket