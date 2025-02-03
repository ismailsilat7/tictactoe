
function GameBoard() {
    const row = 3;
    const col = 3;
    const board = [];

    const resetBoard = () => {
        for (let i = 0; i < row; i++) {
            board[i] = [];
            for (let j = 0; j < col; j++) {
                board[i].push(' ');
            }
        }
    }
    
    resetBoard();

    const getBoard = () => board;

    const updateBoard = (i, j, sign) => {
        if (board[i][j] == ' ') {
            board[i][j] = sign;
            return true;
        } else {
            console.log("invalid turn");
            return false;
        }
    }

    const isWinner = (sign) => {
        for (let i = 0; i < 3; i++) {
            if (board[i].every(cell => cell === sign)) return true; //rows
            if (board[0][i] === sign && board[1][i] === sign && board[2][i] === sign) return true; //columns
        }
        if ((board[0][0] === sign && board[1][1] === sign && board[2][2] === sign) || 
            (board[0][2] === sign && board[1][1] === sign && board[2][0] === sign)) {
            return true; //diagonals
        }
        return false;
    };
    
    
    const isOver = () => {
        if (isWinner("X")) {
            return 1;
        } else if (isWinner("O")) {
            return 2;
        }
        else {
            let count = 0;
            for (let i = 0; i < row; i++) {
                for(let j = 0; j < col; j++) {
                    count += (board[i][j] == ' ') ? 0 : 1;
                }
            }
            return (count == 9) ? 0 : -1;
        }
    }

    const displayBoard = () => {
        for (let i = 0; i < row; i++) {
            console.log(`|${board[i][0]}|${board[i][1]}|${board[i][2]}|`);
            if (i < row - 1) console.log(" - - - ");
        }
    };
    

    return {
        getBoard, updateBoard, isOver, isWinner, displayBoard, resetBoard
    };

}

function Player(n, s) {
    let name = n;
    const sign = s;
    let score = 0;

    const updateScore = () => score++;
    const getScore = () => score;
    const getName = () => name;
    const getSign = () => sign;

    const resetScore = () => {
        score = 0;
    }

    const updateName = (new_n) => {
        name = new_n;
        resetScore();
    }

    return {getName, getSign, updateScore, getScore, updateName, resetScore};
}

function gameController(name1, name2) {

    const player1 = Player(name1, 'X');
    const player2 = Player(name2, 'O')
    let status = 1; // 1 for ongoing, -1 for over
    const board = GameBoard();
    let activePlayer = player1;

    const getStatus = () => status; 
    board.displayBoard();
    const switchPlayerTurn = () => {
        activePlayer = (activePlayer == player1) ? player2 : player1;
    }
    const getActivePlayer = () => activePlayer;
    const playMove = (row, col) => {
        console.log(`${activePlayer.getName()} is playing at ${row}, ${col}`);
        let valid = board.updateBoard(row, col, activePlayer.getSign());

        if(valid) {
            let over = board.isOver();
            if(over != -1) {
                status = -1;
            }
            if (over == 1) {
                player1.updateScore();
            } else if(over == 2) {
                player2.updateScore();
            } else if(over == 0) {
                announceDraw();
            } else {
                switchPlayerTurn();
            }
        } else {
            console.log("Invalid move!");
        }
        board.displayBoard();
    }

    const restart = () => {
        switchPlayerTurn();
        board.resetBoard();
        status = 1;
    }

    return {
        switchPlayerTurn, getActivePlayer, playMove, getStatus, getBoard: board.getBoard, player1, player2, isOver: board.isOver, resetBoard: board.resetBoard, restart
    };

}

console.log("Tic Tac Toe");

function ScreenController(name1, name2) {
    
    const game = gameController(name1, name2);
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const versusDiv = document.querySelector('.versus');
    const player1Card = document.querySelector('.player1-card');
    const player2Card = document.querySelector('.player2-card');
    const edit = document.querySelectorAll('.edit');
    const dialog = document.getElementById('dialog');
    const cancelBtn = document.getElementById('cancelBtn');
    const nameForm = document.getElementById('nameForm');
    const restartBtn = document.getElementById('restartBtn');
    const resetScore = document.getElementById('resetBtn');


    const updateScreen = () => {
        versusDiv.textContent = `${game.player1.getName()} vs ${game.player2.getName()}`;

        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if(game.getStatus() != -1) {
            playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`;
        }
        let rowCount = 0;
        board.forEach(row => {
            row.forEach((item, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.column = index;
                cellButton.dataset.row = rowCount;
                cellButton.textContent = item;
                
                if (item == 'X') {
                    cellButton.style.backgroundColor = '#FAE3D9';
                } else if (item == 'O') {
                    cellButton.style.backgroundColor = '#DDE5B6';
                }
                
                boardDiv.appendChild(cellButton);
            });
            rowCount++;
        });
        
    }

    const updateCards = () => {

        player1Card.querySelector('.player1-name').textContent = game.player1.getName();
        player1Card.querySelector('.player1-sign').textContent = "Weapon: " + game.player1.getSign();
        player1Card.querySelector('.player1-score').textContent = "Score: " + game.player1.getScore();

        player2Card.querySelector('.player2-name').textContent = game.player2.getName();
        player2Card.querySelector('.player2-sign').textContent = "Weapon: " + game.player2.getSign();
        player2Card.querySelector('.player2-score').textContent = "Score: " + game.player2.getScore();

    }

    updateCards();

    boardDiv.addEventListener("mouseout", (e) => {
        updateScreen();
    });

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();

    resetScore.addEventListener('click', () => {
        game.player1.resetScore();
        game.player2.resetScore();
        updateCards();
    })

    restartBtn.addEventListener('click', () => {
        game.restart();
        updateScreen();
    })

    edit.forEach((element) => {
        element.addEventListener("click", displayForm)
    });

    cancelBtn.addEventListener('click', () => {
        nameForm.reset();
        dialog.close()
    });

    nameForm.addEventListener('submit', (event)=> {
        event.preventDefault();
    
        const formData = {

            player1Name : document.getElementById('player1').value.trim(),
            player2Name : document.getElementById('player2').value.trim()
        };
    
        game.player1.updateName(formData.player1Name);
        game.player2.updateName(formData.player2Name);
        updateCards();
        updateScreen();
        dialog.close();
        nameForm.reset();
    });

    let announced = false;
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        if (!selectedColumn || !selectedRow) return;
        if (game.getStatus() == 1) {
            game.playMove(selectedRow, selectedColumn);
            announced = false;
        } 
        if (game.getStatus() == -1) {
            let over = game.isOver();
            if (over == 1 || over == 2) {
                if(!announced) {
                    announceWinner(over);
                    announced = true;
                }
                updateCards();
            }
            else if(over == 0) {
                if(!announced) {
                    announceDraw();
                    announced = true;
                }
            }
        }
        updateScreen();
    }

    boardDiv.addEventListener("mouseover", (e) => {
        if(game.getStatus() != -1) {
            if (e.target.classList.contains("cell") && e.target.textContent === ' ') {
                e.target.textContent = game.getActivePlayer().getSign();
                e.target.style.color = "#93C5FD";
            }
        }
        
    });

    const announceWinner = (num) => {
        let winner = (num == 1) ? game.player1 : game.player2;
        playerTurnDiv.textContent = `${winner.getName()} Won! 🎉`;
        displayAnnouncement(`${winner.getName()} Won! 🎉`);


    }

    const announceDraw = () => {
        playerTurnDiv.textContent = "It's a draw!";
        displayAnnouncement("It's a draw!");
    }

    function displayAnnouncement(message) {
        const announcementDiv = document.querySelector('.announcement');

        announcementDiv.style.display = 'flex';
        announcementDiv.textContent = message;

        setTimeout(() => {
            announcementDiv.textContent = '';
            announcementDiv.style.display = 'none';
        }, 2000);
    }

    function displayForm() {
        dialog.showModal();
        document.getElementById('player1').value = game.player1.getName();
        document.getElementById('player2').value = game.player2.getName();
    }

}

const startForm = document.getElementById('startForm');
const startSection = document.querySelector('.start');
const mainSection = document.querySelector('.main')

startForm.addEventListener('submit', (event)=> {
    event.preventDefault();

    const formData = {
        player1Name : document.getElementById('player1-start').value.trim(),
        player2Name : document.getElementById('player2-start').value.trim()
    };

    if(formData.player1Name == '' || formData.player2Name == '') {
        alert("Please fill out all required fields in the form!");
    } else {
        startSection.style.display = 'none';
        mainSection.style.display = 'flex';

        ScreenController(formData.player1Name, formData.player2Name);
    }
    
});





