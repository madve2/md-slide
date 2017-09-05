//Mini server to keep the slide show (and notes) in sync across browsers
//(Designed to be used on localhost only)

let http = require("http")
let ws = require("nodejs-websocket")
let express = require("express")
let path = require("path")
let process = require("process")
let app = express();
let server = http.Server(app);
const port = process.env.PORT || 8083;

app.use(express.static(path.resolve('content'))); //TODO: maybe it shouldn't serve .md files (then again, it won't matter locally)

let wserver = ws.createServer(function (connection) {
	connection.on("text", function (str) {
		console.log("Next slide: " + str);
		broadcast(str);
	})
})

process.on('uncaughtException', function(err) {
	console.log("Oh, lookie, an error: ");
    console.log(err);
})

function broadcast(str) {
	wserver.connections.forEach(function (connection) {
		connection.sendText(str);
	})
}

wserver.listen(port);

server.listen(port + 1);