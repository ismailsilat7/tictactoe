
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
    const name = n;
    const sign = s;

    const getName = () => name;

    const getSign = () => sign;

    return {getName, getSign};
}

function gameController(name1, name2) {

    const player1 = Player(name1, 'X');
    const player2 = Player(name2, 'O')
    
    let status = 1; // 1 for ongoing, -1 for over

    const getStatus = () => status;

    const board = GameBoard();
    board.displayBoard();

    let activePlayer = player1;

    const switchPlayerTurn = () => {
        activePlayer = (activePlayer == player1) ? player2 : player1;
    }

    const getActivePlayer = () => activePlayer;

    const announceWinner = (num) => {
        let winner = (num == 1) ? player1 : player2;
        console.log(`Winner is ${winner.getName()}`);
    }

    const announceDraw = () => {
        console.log("This game is a draw");
    }

    const playMove = (row, col) => {
        console.log(`${activePlayer.getName()} is playing at ${row}, ${col}`);
        let valid = board.updateBoard(row, col, activePlayer.getSign());

        if(valid) {
            let over = board.isOver();
            if(over != -1) {
                status = -1;
            }
            
            if(over == 1 || over == 2) {
                announceWinner(over);
            }
            else if(over == 0) {
                announceDraw();
            } else {
                switchPlayerTurn();
            }

        } else {
            console.log("Invalid move!");
        }

        if (status == -1) {
            let response = prompt("Restart game? (Y/N)");

            if (response == 'Y') {
                console.log("Restarting game!");
                board.resetBoard();
                status = 1;
            } else {
                console.log("Thank you for playing!");
            }

        }

        board.displayBoard();

        

    }

    return {
        switchPlayerTurn, getActivePlayer, playMove, getStatus
    };

}

console.log("Tic Tac Toe");
//let name1 = prompt("Enter player one's name: ");
//let name2 = prompt("Enter player two's name: ");

let name1 = "Ismail";
let name2 = "Ali";

const game = gameController(name1, name2);

let row = 0, col = 0; // Example values, replace with user input

/*
while (game.getStatus() != -1) {
    console.log(`${game.getActivePlayer().getName()}'s turn`);
    prompt("Enter row: ");
    prompt("Enter col: ");

    if(row == -1 || col == -1) {
        break;
    }

    console.log(`${game.getActivePlayer().getSign()} at ${row} ${col}`);
    game.playMove(row, col);

    break;
}

*/







