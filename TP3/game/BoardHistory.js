class BoardHistory {
    constructor() {
        this.moveType = {
            SET_WORKER: 'set worker',
            MOVE_WORKER: 'move worker',
            SET_BLACK: 'set black',
            SET_WHITE: 'set white',
            UNDO_WHITE: 'undo white',
            UNDO_BLACK: 'undo black',
            UNDO_WORKER: 'undo worker'
        };

        this.reset();
    }

    reset() {
        this.boards = new Array();
    }

    insertBoard(board) {
        this.boards.push(board);
    }

    getPreviousBoard() {
        if (this.boards.length < 2) return null;

        return this.boards[this.boards.length - 2];
    }

    getCurrentBoard() {
        if (this.boards.length < 1) return null;

        return this.boards[this.boards.length - 1];
    }

    getLastMove() {
        if (this.boards.length < 2) return null;

        return this.boardDifference(
            this.getPreviousBoard(),
            this.getCurrentBoard()
        );
    }

    getLastMoveReversed() {
        if (this.boards.length < 2) return null;
        
        return this.boardDifference(
            this.getCurrentBoard(),
            this.getPreviousBoard()
        );       
    }

    undoLastMove() {
        let move = this.getLastMoveReversed();
        if ( (this.boards.length > 2 && move.workerMove.type == this.moveType.UNDO_WORKER) ||
             (move.pieceMove.type == null && move.workerMove.type == null) ) {
            return null;
        }

        this.boards.pop();

        return move;
    }

    boardDifference(previousBoard, currentBoard) {
        if (! (previousBoard && currentBoard) ) return null;

        let Move = function() {
            this.type = null;
            this.previousCell = null;
            this.currentCell = null;
        };
        let moves = {workerMove: new Move(), pieceMove: new Move()};

        for (let row = 0; row < previousBoard.length; row++) {
            for (let col = 0; col < previousBoard[row].length; col++) {
                let previousEl = previousBoard[row][col];
                let currentEl = currentBoard[row][col];
                
                if (previousEl == currentEl)
                    continue;
        
                if (previousEl == 'worker') {
                    moves.workerMove.type = this.moveType.MOVE_WORKER;
                    moves.workerMove.previousCell = [row, col];
                }
                
                if (currentEl == 'worker') {
                    moves.workerMove.type = this.moveType.MOVE_WORKER;
                    moves.workerMove.currentCell = [row, col];
                } else if (currentEl == 'black') {
                    moves.pieceMove.type = this.moveType.SET_BLACK;
                    moves.pieceMove.currentCell = [row, col];
                } else if (currentEl == 'white') {
                    moves.pieceMove.type = this.moveType.SET_WHITE;
                    moves.pieceMove.currentCell = [row, col];
                } else if (previousEl == 'white' && currentEl == 'none') {
                    moves.pieceMove.type = this.moveType.UNDO_WHITE;
                    moves.pieceMove.currentCell = null;
                    moves.pieceMove.previousCell = [row, col];
                } else if (previousEl == 'black' && currentEl == 'none') {
                    moves.pieceMove.type = this.moveType.UNDO_BLACK;
                    moves.pieceMove.currentCell = null;
                    moves.pieceMove.previousCell = [row, col];      
                } else if (! (previousEl == 'worker' && currentEl == 'none') ) {
                    console.error("Unhandled situation in boardDifference. " + previousEl + " -> " + currentEl);
                }
            }
        }

        if (moves.workerMove.previousCell == null && moves.workerMove.type != null) {
            moves.workerMove.type = this.moveType.SET_WORKER;
        } else if (moves.workerMove.currentCell == null && moves.workerMove.type != null) {
            moves.workerMove.type = this.moveType.UNDO_WORKER;
        }   

        return moves;
    }
}