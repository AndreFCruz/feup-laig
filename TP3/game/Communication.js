const COMMMUNICATION_PORT = 8081;
const GET_LISTS_REGEX = /((?<=\[\[).+?(?=\|))|((?<=],\[).+?(?=\|))/g;
const GET_ELEMENTS_REGEX = /[a-z]+(?=,)|(?<=,).+/g;

function getPrologRequest(requestString)
{
    var serverAnswer;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + COMMMUNICATION_PORT + '/' + requestString, true);

    request.onload = function(data) {
        serverAnswer = data.target.response;
        console.log("Request successful. Reply: " + serverAnswer);
        listsToBoard(serverAnswer);
    };
    request.onerror = function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();

    return serverAnswer;
}

function boardToLists(board) {

}

function listsToBoard(lists) {
    let rows = lists.match(GET_LISTS_REGEX);
    let board = {};

    for (let i = 0; i < rows.length; ++i) {

        board[i] = {};
        board[i] = rows[i].match(GET_ELEMENTS_REGEX);
    }

    return board;
}