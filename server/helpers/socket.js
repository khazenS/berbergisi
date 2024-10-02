

const setupSocket = (io) => {
    io.on('connection',(socket) => {
        console.log('user connected')
        socket.on('disconnect', () => {
            console.log('user disconnected');
          });
        //Listen 'status' socket
        socket.on('changeStatus',(datas) => {
            //Send to all client
            io.emit('changedStatus',datas)
        })
        //Listen 'orderFeature' socket
        socket.on('changeOrderFeature',(data) => {
            //Send to all client
            io.emit('changedOrderFeature',data)
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

        // remove user from que on admin
        socket.on('remove-que',(datas) => {
            io.emit('remove' , datas)
        })
        // finish cut
        socket.on('finish-cut',(datas) =>{
            io.emit('finished-cut', datas)
        })
        // up move socket for admin process
        socket.on('up-move',(datas) =>{
            io.emit('up-moved', datas)
        })
        // down move socket for admin process
        socket.on('down-move',(datas) =>{
            io.emit('down-moved', datas)
        })
        // fast user socket for admin process
        socket.on('fastUser-register',(datas) =>{
            io.emit('fastUser-registered', datas.fastUserDatas)
        })
        // shop settings socket for admin process
        socket.on('get-shopSettings',(datas) =>{
            io.emit('sended-shopSettings', datas)
        })
        // show message socket for admin process
        socket.on('get-message',(datas) =>{
            io.emit('sended-message', datas)
        })
        // delete message socket for admin process
        socket.on('delete-message',() =>{
            io.emit('deleted-message')
        })
        // increased amount socket for admin process
        socket.on('increase-amount',(amount) =>{
            io.emit('increased-amount',amount)
        })
        // decreased amount socket for admin process
        socket.on('decrease-amount',(amount) =>{
            io.emit('decreased-amount',amount)
        })
        // auto status changed
        socket.on('oto-status-change',(status) =>{
            io.emit('oto-status-change',status)
        })
        // set oto opening time 
        socket.on('set-oto-opening-time',(datas) =>{
            io.emit('set-oto-opening-time',datas)
        })
    })
}

module.exports = setupSocket