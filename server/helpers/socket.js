import { io } from "../app.js"

const setupSocket = (io) => {
    io.on('connection',(socket) => {
        console.log('user connected')
        socket.on('disconnect', () => {
            console.log('user disconnected');
          });
        //Listen 'status' socket
        socket.on('changeStatus',(status) => {
            //Send to all client
            io.emit('changedStatus',status)
        })
    })
}

export default setupSocket