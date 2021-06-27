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
    console.log(`player connected : ${socket.id}`);

    socket.on('turn', turnData => {
        socket.broadcast.emit('turn', turnData);
    });

    socket.on('winner', msg => {
        console.log(msg);
        socket.broadcast.emit('winner', msg);
    })

    socket.on('disconnect', ()=>{
        console.log('player disconnected');
    });
})

server.listen(8000, ()=>{
    console.log('Fuck yeah!');
})