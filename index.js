const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io')

const app = express();
app.use(cors())
const port = 4500 || process.env.PORT

const users = [{}]

app.get('/', (req, res) => {
    console.log('test')
})

const server = http.createServer(app);

const io = socketIO(server)
io.on('connection', (socket) => {
    console.log('New Connection');

    socket.on('joined', ({ user }) => {

        users[socket.id] = user;
        console.log(`${user} has joined`)
        socket.broadcast.emit('userJoined', { message: `${users[socket.id]} has joined` })
        socket.emit('welcome', { message: `Welcome to the Chat, ${users[socket.id]}` })
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id });
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { message: `${users[socket.id]} has left` });
        console.log('user left')
    })
})

server.listen(port, () => {
    console.log(`server is working at: http://localhost:${port}`);
})
