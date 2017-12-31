/**
 * Class used to represent the game / board history
 * Useful for functionalities such as: 'Undo', 'Watch Game Film' and piece animations
 */
class BoardHistory {

    /**
     * Board History constructor
     * 
     * @constructor
     */
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

    /**
     * Reset the board history, by creating a new array of boards
     * 
     * @return {null}
     */
    reset() {
        this.boards = new Array();
    }

    /**
     * Updates board history by updating the array of boards with a new board
     * 
     * @param {Object} board - The board to insert in array
     * @return {null}
     */
    insertBoard(board) {
        this.boards.push(board);
    }

    /**
     * Gets the penultimate board, if there is one
     * 
     * @return {Object} - The penultimate board
     */
    getPreviousBoard() {
        if (this.boards.length < 2) return null;

        return this.boards[this.boards.length - 2];
    }

    /**
     * Gets the last board of the board of the arrays, the current board
     * 
     * @return {Object} - The current board
     */
    getCurrentBoard() {
        if (this.boards.length < 1) return null;

        return this.boards[this.boards.length - 1];
    }

    /**
     * Gets the last move made, by getting the board Difference between the current and previous board
     * Opposite function of @see getLastMoveReversed
     * @see boardDifference
     * 
     * @return {Object} - The last move made by the Player
     */
    getLastMove() {
        if (this.boards.length < 2) return null;

        return this.boardDifference(
            this.getPreviousBoard(),
            this.getCurrentBoard()
        );
    }

    /**
     * Gets the last move made by the player, but reversed: difference between the previous and current board
     * Opposite function of @see getLastMove
     * @see boardDifference
     * 
     * @return {Object} - The last move made by the Player
     */
    getLastMoveReversed() {
        if (this.boards.length < 2) return null;
        
        return this.boardDifference(
            this.getCurrentBoard(),
            this.getPreviousBoard()
        );       
    }

    /**
     * Get the move between two boards, those being at position (index) and (index + 1) in the boards array
     * 
     * @param {Number} index 
     */
    getMoveByIndex(index) {
        if (index == null || index >= this.boards.length - 1)
            return null;
        
        let board1 = this.boards[index];
        let board2 = this.boards[index + 1];
        return this.boardDifference(board1, board2);
    }

    /**
     * Undo the last move made by the Player
     * 
     * @return {Object} - Move that was undoed
     */
    undoLastMove() {
        let move = this.getLastMoveReversed();
        if ( (this.boards.length > 2 && move.workerMove.type == this.moveType.UNDO_WORKER) ||
             (move.pieceMove.type == null && move.workerMove.type == null) ) {
            return null;
        }

        this.boards.pop();

        return move;
    }

    /**
     * Computes the difference between two given boards
     * The difference comes as a Move, that can affect both a worker and a piece
     * A move has a previous cell, current cell and type of move, useful for later displaying an animation
     * 
     * @param {Object} previousBoard - The previous board
     * @param {Object} currentBoard - The most recent board
     * @return {Object} - The difference as the two boards, as a move
     */
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