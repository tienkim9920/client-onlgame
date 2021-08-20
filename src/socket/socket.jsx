import io from "socket.io-client";

var connectionOptions = {               
    "transports": ["websocket"]
};

const socket = io.connect('http://localhost:4000', connectionOptions)

export default socket