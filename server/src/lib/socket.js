import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

const app = express()

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin : ['http://localhost:5173']
    },
})

export function getRecieverSocketId(userId)  {
    return usersocketMap[userId];
}

// userd to store online users
const usersocketMap =  {}




io.on('connection', (socket) => {  // this socket is the client socket that is user that just connected
    console.log("user connected", socket.id);

    //upon listening connection event

    const userId = socket.handshake.query.userId; // we are getting the userId from the client side

    if (userId) usersocketMap[userId] = socket.id; // we are storing the socket in the usersocketMap

    // used to send events to broadcast to every single user that is connected
    io.emit('getonlineusers',Object.keys(usersocketMap)); // we are sending the online users to the client side (getonlineusers is the event name)
    socket.on('disconnect', () => {
        console.log("user disconnected", socket.id);
        delete usersocketMap[userId]; // we are deleting the user from the usersocketMap
        io.emit('getonlineusers',Object.keys(usersocketMap)); // we are sending the online users to the client side
    })  // we are listening for the disconnect event
}) 




export { io, app, server };