import http from "http";
import app from "./app.js";
import initSocket from "./socket/index.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(port, (req, res) => {
  console.log("server is listening at port no :", port);
});