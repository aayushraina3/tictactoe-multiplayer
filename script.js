document.addEventListener('DOMContentLoaded', function(){
    
    const b1 = document.getElementById('box1');
    const b2 = document.getElementById('box2');
    const b3 = document.getElementById('box3');
    const b4 = document.getElementById('box4');
    const b5 = document.getElementById('box5');
    const b6 = document.getElementById('box6');
    const b7 = document.getElementById('box7');
    const b8 = document.getElementById('box8');
    const b9 = document.getElementById('box9');

    const result = document.getElementById('result');
    const resultDiv = document.getElementById('resultDiv');
    
    // player true : X and false : O
    let player = true;

    
    // add click event listener to boxes
    const boxes = document.getElementsByClassName('box');
    for(let i=0; i<boxes.length; i++){
        boxes.item(i).addEventListener('click', playerTurn);
    }


    // individual player's turn
    function playerTurn(){
 
        if(player){
            this.innerHTML = 'X';
        }
        else{
            this.innerHTML = 'O';
        }

        this.style.backgroundColor = '#508688';
        this.removeEventListener('click', playerTurn);
        
        if(checkForWin()){
            for(let i=0; i<boxes.length; i++){
                boxes.item(i).removeEventListener('click', playerTurn);
            }
            
            let btn = document.createElement('button');
            btn.innerHTML = 'New Game?'
            resultDiv.appendChild(btn);

            btn.addEventListener('click', function(){
                window.location.reload();
            })
        }
        else{
            // change turn
            player = !player;
        }
    }

    
    // check grid for possible win
    function checkForWin(){
        if((b1.innerHTML == 'X' && b2.innerHTML == 'X' && b3.innerHTML == 'X') 
        || (b4.innerHTML == 'X' && b5.innerHTML == 'X' && b6.innerHTML == 'X') 
        || (b7.innerHTML == 'X' && b8.innerHTML == 'X' && b9.innerHTML == 'X') 
        || (b1.innerHTML == 'X' && b4.innerHTML == 'X' && b7.innerHTML == 'X') 
        || (b2.innerHTML == 'X' && b5.innerHTML == 'X' && b8.innerHTML == 'X') 
        || (b3.innerHTML == 'X' && b6.innerHTML == 'X' && b9.innerHTML == 'X') 
        || (b1.innerHTML == 'X' && b5.innerHTML == 'X' && b9.innerHTML == 'X') 
        || (b3.innerHTML == 'X' && b5.innerHTML == 'X' && b7.innerHTML == 'X')){
            //X Wins
            result.innerHTML = 'Player X has won. Better luck next time O';
            return true;
        }
        else if((b1.innerHTML == 'O' && b2.innerHTML == 'O' && b3.innerHTML == 'O') 
        || (b4.innerHTML == 'O' && b5.innerHTML == 'O' && b6.innerHTML == 'O') 
        || (b7.innerHTML == 'O' && b8.innerHTML == 'O' && b9.innerHTML == 'O') 
        || (b1.innerHTML == 'O' && b4.innerHTML == 'O' && b7.innerHTML == 'O') 
        || (b2.innerHTML == 'O' && b5.innerHTML == 'O' && b8.innerHTML == 'O') 
        || (b3.innerHTML == 'O' && b6.innerHTML == 'O' && b9.innerHTML == 'O') 
        || (b1.innerHTML == 'O' && b5.innerHTML == 'O' && b9.innerHTML == 'O') 
        || (b3.innerHTML == 'O' && b5.innerHTML == 'O' && b7.innerHTML == 'O')){
            //O Wins
            result.innerHTML = 'Player O has won. Better luck next time X';
            return true;
        }
        else{
            return false;
        }
    }

});