/**
 * Port used for communication with PROLOG
 */
const COMMMUNICATION_PORT = 8081;
/**
 * ReGex used for parsing a prolg list of lists (string) into several objects of rows.
 * https://regex101.com/r/Z35NUT/9
 */
const GET_LISTS_REGEX = /\[((?:\w*,?)*)\]/g;
/**
 * ReGex used for parsing the row (string) into several objects of unit elements.
 * https://regex101.com/r/Z35NUT/12
 */
const GET_ELEMENTS_REGEX = /\w+/g;


class Communication {

    /**
     * Constructor for Communication class.
     * 
     * @param {Object} game - The game that uses the communication to Prolog 
     * @constructor
     */
    constructor(game) {
        
        // Variable containing the PLOG answers to the requests
        this.prologBoard = null;
        
        // Variable indicating whether the variable prologBoard truly changed
        this.boardChanged = false;

        this.game = game;
    }

    /**
     * Send a request to Prolog.
     * Prolog answer will be handled internally
     * 
     * @param {String} requestString - String that will be sent to Prolog
     * @return {null}
     */
    getPrologRequest(requestString)
    {
        console.log("GET prolog request: ");
        console.log(requestString);

        //Since this will become XMLHttpRequest(), need to save the communicatopn to call functions
        let communication = this;

        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + COMMMUNICATION_PORT + '/' + requestString, true);

        request.onload = function() {
            let serverAnswer = this.response;
            console.log("Request loaded. Reply: " + serverAnswer);

            if (this.status != 200) {
                console.error("Server denied request.");
                // TODO visual cue for error in action
                swal('Invalid Move', 'Please select a cell in the intersection of the lines of sight of the two workers', 'error');
            } else {
                communication.handleServerAnswer(serverAnswer);
            }
        };
        request.onerror = function() {
            console.log("Error waiting for response");
        };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    /**
     * Handle the Prolog andswer to the last made request
     * 
     * @param {String} answer - Prolog answer to the made request
     */
    handleServerAnswer(answer) {
        //If v from victory is found
        if (answer.charAt(0) == 'v')
            this.game.resetGame(answer);
        else {
            this.prologBoard = this.parseBoardFromPlog(answer);
            this.boardChanged = true;
        }
    }

    /**
     * Parses a Board matrix into a string containg a Prolog List of lists.
     * 
     * @param {Object} board - The board to be parsed into the prolog list of lists
     * @return {String} - Prolog list of lists
     */
    parseBoardToPlog(board) {
        let listLists = "[";

        for (let row in board) {
            let list = "[";

            for (let element in board[row]) {
                list = list.concat(board[row][element], ',');
            }

            //Removing last comma and adding to list
            listLists = listLists.concat(list.slice(0, list.length - 1), "],");
        }

        let tempList = listLists.slice(0, listLists.length - 1);
        listLists = tempList.concat("]");
        return listLists;
    }

    /**
     * Parses a string containing a Prolog list of lists to a board
     * 
     * @param {String} str - The Prolog list of lists, as a string
     * @return {object} - The board matrix
     */
    parseBoardFromPlog(str) {
        let rows = str.match(GET_LISTS_REGEX);
        let board = [];

        for (let i = 0; i < rows.length; ++i) {
            board[i] = rows[i].match(GET_ELEMENTS_REGEX);
        }

        return board;
    }

}