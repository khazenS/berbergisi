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

        //Listen registered user socket
        socket.on('newRegister',(user) => {
            // Send to all client
            io.emit('newUser',user)
        })

        // cancel the que
        socket.on('cancel-que',(userBookingID)=>{
            io.emit('cancel', userBookingID)
        })
    })
}

export default setupSocket