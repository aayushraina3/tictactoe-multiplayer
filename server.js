const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + 'index.html');
})

io.on('connection', (socket) => {
    console.log('player connected');
    socket.on('chat message', msg => {
        console.log(msg.message);
        console.log(msg.boxID);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', ()=>{
        console.log('player disconnected');
    });
})

server.listen(8000, ()=>{
    console.log('Fuck yeah!');
})