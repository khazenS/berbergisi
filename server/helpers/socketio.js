const { Server } = require("socket.io");
let io;

const initializeSocket = (server) => {
    while(!io){
        io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            },
            transports: ["websocket"]
        });        
    }
    io.on("connection", (socket) => {
        console.log("Socket Connection.")
        
        socket.on("disconnect", () => {
            console.log("Socket Disconnection.")
        });
    });
    console.warn("socketio was initilized!");
    return io;
};

const getIO = () => {
    return io;
};

module.exports = { initializeSocket, getIO };
