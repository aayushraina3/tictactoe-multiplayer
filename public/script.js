document.addEventListener('DOMContentLoaded', function(){
    var socket = io();

    const b0 = document.getElementById('box1'); //0
    const b1 = document.getElementById('box2'); //1
    const b2 = document.getElementById('box3'); //2
    const b3 = document.getElementById('box4'); //3
    const b4 = document.getElementById('box5'); //4
    const b5 = document.getElementById('box6'); //5
    const b6 = document.getElementById('box7'); //6
    const b7 = document.getElementById('box8'); //7
    const b8 = document.getElementById('box9'); //8

    let currPlayer = document.getElementById('currPlayer');
    const result = document.getElementById('result');
    const resultDiv = document.getElementById('resultDiv');

    // no of boxes played
    let count = 0;
    const boxes = document.getElementsByClassName('box');
    
    // your turn: true, opponent's turn: false
    let playertoMove;

    // X or O
    let player;

    
    socket.on("game begin", playerData => {
        document.getElementById("status").innerHTML = "Game started"
        player = playerData.player;

        if(player == "X"){
            playertoMove = true;
            currPlayer.innerHTML = "Your turn";
        }
        else{
            document.querySelector(".boxes-overlay").style.display = "block";
            playertoMove = false;
            currPlayer.innerHTML = "Opponent's turn";
        }

        gameSetup();
    })


    
    
    function gameSetup(){
        // add click event listener to boxes
        
        for(let i=0; i<boxes.length; i++){
            boxes.item(i).setAttribute('data-id', i);
            boxes.item(i).addEventListener('click', playerTurn);
        }
    }


    
    // individual player's turn :
    // -> Add 1 to count of turns
    // -> remove click listener from 'this' box
    // -> add turn symbol to 'this' box node
    // -> emit turn event to server with current turn info to be displayed on opponent's board
    function playerTurn(){

        count ++;
        this.removeEventListener('click', playerTurn);
        
        let thisBoxID = parseInt(this.getAttribute('data-id'), 10);
        
        if(player == "X"){
            addSymbolToNode(this, "X", "images/x.png");
        }
        else{
            addSymbolToNode(this, "O", "images/o.png");
        } 

        socket.emit('turn', {player: player, boxID: thisBoxID, count: count});
        console.log("count on socket emit: " + count);
        
        // change turn for current(sending) socket
        playertoMove = !playertoMove;
        
        if(playertoMove){
            document.querySelector(".boxes-overlay").style.display = "none";
            currPlayer.innerHTML = "Your turn";
        } 
        else{
            document.querySelector(".boxes-overlay").style.display = "block";
            currPlayer.innerHTML = "Opponent's turn";
        } 
        
        // check for winner
        winner = (checkForWinner(thisBoxID,player)) ? player : '';
        if(winner != ''){
            endgame();
            result.innerHTML = `Yay! you have won.`;
            
            // emit winner event with winner
            socket.emit('winner', winner);
        }
        else if(checkforTie()){
            endgame();
            result.innerHTML = `Game Tied.`;
            
            // emit winner event with tie
            socket.emit('winner', 'tie');
        }
    }

    
    
    socket.on('turn', msg => {

        let targetBox = document.getElementById(`box${msg.boxID + 1}`);
        targetBox.removeEventListener('click', playerTurn);

        if(msg.player == "X"){
            addSymbolToNode(targetBox, "X", "images/x.png");
        }
        else{
            addSymbolToNode(targetBox, "O", "images/o.png");
        }

        // change turn for other(receiving) socket
        playertoMove = !playertoMove;

        if(playertoMove){
            document.querySelector(".boxes-overlay").style.display = "none";
            currPlayer.innerHTML = "Your turn";
        } 
        else{
            document.querySelector(".boxes-overlay").style.display = "block";
            currPlayer.innerHTML = "Opponent's turn";
        }

        count = msg.count
        console.log("count on socket receive: "+count);
    })

    
    
    socket.on('winner', msg => {
        if(msg != 'tie'){
            endgame();
            result.innerHTML = `Sorry! ${msg} has won.`;
        }else{
            endgame();
            result.innerHTML = `Game Tied.`;
        }
    })


    
    // create image element with turn symbol
    // append image to box
    function addSymbolToNode(node, value, src){
        let img = document.createElement("img");
        img.setAttribute("src", src);
        node.appendChild(img);
        node.setAttribute("value", "X");
    }
    
    
    
    // check grid for possible win

    // 0 1 2
    // 3 4 5
    // 6 7 8

    function checkForWinner(position, symbol){
        switch(position){
            case 0: {
                // 1 2
                // 3 6
                // 4 8
                if (b1.getAttribute("value") == symbol && b2.getAttribute("value") == symbol || 
                    b3.getAttribute("value") == symbol && b6.getAttribute("value") == symbol || 
                    b4.getAttribute("value") == symbol && b8.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 1: {
                // 0 2
                // 4 7
                if (b0.getAttribute("value") == symbol && b2.getAttribute("value") == symbol || 
                    b4.getAttribute("value") == symbol && b7.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 2: {
                // 0 1
                // 4 6
                // 5 8
                if (b0.getAttribute("value") == symbol && b1.getAttribute("value") == symbol || 
                    b4.getAttribute("value") == symbol && b6.getAttribute("value") == symbol || 
                    b5.getAttribute("value") == symbol && b8.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 3: {
                // 0 6
                // 4 5
                if (b0.getAttribute("value") == symbol && b6.getAttribute("value") == symbol || 
                    b4.getAttribute("value") == symbol && b5.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 4: {
                // 0 8
                // 2 6
                // 1 7
                // 3 5
                if (b0.getAttribute("value") == symbol && b8.getAttribute("value") == symbol || 
                    b2.getAttribute("value") == symbol && b6.getAttribute("value") == symbol || 
                    b1.getAttribute("value") == symbol && b7.getAttribute("value") == symbol ||
                    b3.getAttribute("value") == symbol && b5.getAttribute("value") == symbol){
                    return true;
                }
                break;
            }
            case 5: {
                // 2 8
                // 3 4
                if (b2.getAttribute("value") == symbol && b8.getAttribute("value") == symbol || 
                    b3.getAttribute("value") == symbol && b4.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 6: {
                // 0 3
                // 2 4
                // 7 8
                if (b0.getAttribute("value") == symbol && b3.getAttribute("value") == symbol || 
                    b2.getAttribute("value") == symbol && b4.getAttribute("value") == symbol || 
                    b7.getAttribute("value") == symbol && b8.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 7: {
                // 1 4
                // 6 8
                if (b1.getAttribute("value") == symbol && b4.getAttribute("value") == symbol || 
                    b6.getAttribute("value") == symbol && b8.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            case 8: {
                // 2 5
                // 0 4
                // 6 7
                if (b2.getAttribute("value") == symbol && b5.getAttribute("value") == symbol || 
                    b0.getAttribute("value") == symbol && b4.getAttribute("value") == symbol || 
                    b6.getAttribute("value") == symbol && b7.getAttribute("value") == symbol){
                    return true;
                } 
                break;
            }
            default:{
                return false;
            }
        }
    }

    
    // game over
    function endgame(){
        for(let i=0; i<boxes.length; i++){
            boxes.item(i).removeEventListener('click', playerTurn);
        }

        currPlayer.innerHTML = "";
        
        let btn = document.createElement('button');
        btn.innerHTML = 'New Game?';
        btn.setAttribute('class', 'new-btn');
        resultDiv.appendChild(btn);

        btn.addEventListener('click', function(){
            window.location.reload();
        })
    }

    
    function checkforTie(){
        return count === 9;
    }

});