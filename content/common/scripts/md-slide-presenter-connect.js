var port = 8083;

var connection = null;
function connect() {
    connection = new WebSocket("ws://"+window.location.hostname+":"+port);
    connection.onopen = function () {
        console.log("Connection opened");
    }
    connection.onclose = function () {
        console.log("Connection closed");
        setTimeout(connect, 300);
    }
    connection.onerror = function () {
        console.error("Connection error");
        setTimeout(connect, 300);
    }
    connection.onmessage = function (event) {
        window.location.hash = "#" + event.data;
    }
}