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
};

const getIO = () => {
    return io;
};

module.exports = { initializeSocket, getIO };
