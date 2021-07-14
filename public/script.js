var socket = io();
document.addEventListener('DOMContentLoaded', function(){
    // var socket = io();

    const b0 = document.getElementById('box1'); //0
    const b1 = document.getElementById('box2'); //1
    const b2 = document.getElementById('box3'); //2
    const b3 = document.getElementById('box4'); //3
    const b4 = document.getElementById('box5'); //4
    const b5 = document.getElementById('box6'); //5
    const b6 = document.getElementById('box7'); //6
    const b7 = document.getElementById('box8'); //7
    const b8 = document.getElementById('box9'); //8

    
    const currPlayer = document.getElementById('currPlayer');
    const result = document.getElementById('result');
    const resultDiv = document.getElementById('resultDiv');
    const boxOverlay = document.querySelector(".boxes-overlay");
    const boxes = document.getElementsByClassName('box');
    const gameStatus = document.getElementById("status");

    
    // no of boxes played
    let count = 0;
    
    
    // your turn: true, opponent's turn: false
    let playertoMove;

    
    // X or O
    let player;

    

    
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
    // -> emit turn event to server
    //    (pass player, box id and turn count)
    // -> change playerToMove 
    //    (to signify opponent's turn)
    // -> check for winner or tie and emit winner event
    function playerTurn(){

        count ++;
        this.removeEventListener('click', playerTurn);
        
        if(player == "X"){
            addSymbolToNode(this, "X", "images/x.png");
        }
        else{
            addSymbolToNode(this, "O", "images/o.png");
        }
        

        let thisBoxID = parseInt(this.getAttribute('data-id'), 10);
        socket.emit('turn', {player: player, boxID: thisBoxID, count: count});

        
        
        // change turn for current(sending) socket
        playertoMove = !playertoMove;
        
        if(playertoMove){
            boxOverlay.style.display = "none";
            currPlayer.innerHTML = "Your turn";
        } 
        else{
            boxOverlay.style.display = "block";
            currPlayer.innerHTML = "Opponent's turn";
        } 
        
        
        
        // check for winner
        winner = (checkForWinner(thisBoxID,player)) ? player : '';
        if(winner){
            endgame();
            result.innerHTML = "Yay! you have won.";
            
            // emit winner event with winner
            socket.emit('winner', winner);
        }
        else if(checkforTie()){
            //endgame();
            result.innerHTML = "Game Tied.";
            
            // emit winner event with tie
            socket.emit('winner', 'tie');
        }
    }



    // create image element with turn symbol
    // append image to box node
    function addSymbolToNode(node, value, src){
        let img = document.createElement("img");
        img.setAttribute("src", src);
        node.appendChild(img);
        node.setAttribute("value", value);
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
    // -> remove all (remaining) event listeners
    // -> remove current player
    // -> add "new game" button
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
    

    
    // check for tie
    function checkforTie(){
        return count === 9;
    }



    // ** socket code **


    // game begin (received on both sockets)
    // -> change game status
    // -> assign player X first turn to move
    // -> display transparent overlay over opponent's board
    // -> setup game board
    socket.on("game begin", playerData => {
        gameStatus.innerHTML = "Game started"
        
        player = playerData.player;
        if(player == "X"){
            playertoMove = true;
            currPlayer.innerHTML = "Your turn";
        }
        else{
            document.querySelector(".boxes-overlay").style.display = "block";
            playertoMove = false;
            currPlayer.innerHTML = "Opponent's turn";
            // document.querySelector(".flipCardInner").style.transform = "rotateY(180deg)";
        }

        gameSetup();
    })


    
    // opponent socket receives turn data
    // -> get targetbox by box id in turn data
    // -> add corresponding symbol
    // -> change playerToMove 
    //    (to signify this socket's turn)
    // -> add count received in turn data to this socket's global count
    socket.on('turn', turnData => {
        let targetBox = document.getElementById(`box${turnData.boxID + 1}`);
        targetBox.removeEventListener('click', playerTurn);

        if(turnData.player == "X"){
            addSymbolToNode(targetBox, "X", "images/x.png");
        }
        else{
            addSymbolToNode(targetBox, "O", "images/o.png");
        }

        
        
        // change turn for other(receiving) socket
        playertoMove = !playertoMove;

        if(playertoMove){
            boxOverlay.style.display = "none";
            currPlayer.innerHTML = "Your turn";
        } 
        else{
            boxOverlay.style.display = "block";
            currPlayer.innerHTML = "Opponent's turn";
        }

        
        
        count = turnData.count;
    })

    
    
    // event received on win or tie
    // -> endgame and display result
    socket.on('winner', winner => {
        if(winner != 'tie'){
            endgame();
            result.innerHTML = `Sorry! ${winner} has won.`;
        }else{
            //endgame(); (since each box is already selected)
            result.innerHTML = `Game Tied.`;
        }
    })


});

function startGame(){
    //flip wrapper
    document.querySelector(".flipCardInner").style.transform = "rotateY(180deg)";
    socket.emit("game-trigger");
}