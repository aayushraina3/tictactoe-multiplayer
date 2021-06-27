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

let players = {}, unmatched;

function playerJoined(socket){
    players[socket.id] = {
        player: "X",
        opponent: unmatched,
        socket: socket
    }

    if(unmatched){
        players[socket.id].player = "O";
        players[unmatched].opponent = socket.id;
        unmatched = null; 
    }else{
        unmatched = socket.id
    }
}

function getOpponent(socket) {
    if (!players[socket.id].opponent) {
        return;
    }
    return players[
        players[socket.id].opponent
    ].socket;
}

io.on('connection', (socket) => {
    console.log(`player connected : ${socket.id}`);
    
    playerJoined(socket);

    if (getOpponent(socket)) {
        socket.emit('game begin', {
            player: players[socket.id].player
        });
        getOpponent(socket).emit('game begin', {
            player: players[getOpponent(socket).id].player
        });
    }

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