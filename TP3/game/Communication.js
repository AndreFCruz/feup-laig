const COMMMUNICATION_PORT = 8081;


function getPrologRequest(requestString)
{
    var serverAnswer;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+ COMMMUNICATION_PORT +'/'+requestString, true);

    request.onload = function(data) {
        serverAnswer = data.target.response;
        console.log("Request successful. Reply: " + serverAnswer);
    };
    request.onerror = function() {
        console.log("Error waiting for response");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();

    return serverAnswer;
}