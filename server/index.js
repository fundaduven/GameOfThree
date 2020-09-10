const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let NUMBER = Math.floor(Math.random() * 1000);
const WINNING_NUMBER = 1;
const PLAYERS = [];
const isStarted = false;
const turnID = 0;
const winner = "";
const isWinner = false;

io.on("connection", (socket) => {
  PLAYERS.push({
    id: socket.id,
    socket,
  });
  console.log("New client connected", PLAYERS, PLAYERS.length);

  if (PLAYERS.length === 2) {
    console.log("buraya geliyo mu?");
    PLAYERS[0].socket.emit("GAME_CREATED", {
      number: NUMBER,
      isStarted: true,
      canPlay: true,
    });
    PLAYERS[1].socket.emit("GAME_CREATED", {
      number: NUMBER,
      isStarted: true,
      canPlay: false,
    });
  }

  socket.on("PLAYER_MOVED", (msg) => {
    console.log("message: " + msg.moveNumber + " //id burda" + socket.id);
    NUMBER = Math.floor((NUMBER + Number(msg.moveNumber)) / 3);
    console.log("New number is", NUMBER);
    const foundPlayer = PLAYERS.find((player) => {
      return player.id === socket.id;
    });
    const otherPlayer = PLAYERS.find((player) => player.id !== foundPlayer.id);

    foundPlayer.socket.emit("GAME_UPDATED", { number: NUMBER, canPlay: false });
    otherPlayer.socket.emit("GAME_UPDATED", { number: NUMBER, canPlay: true });

    if (NUMBER === WINNING_NUMBER) {
      console.log("oyun bitti mi?");
      io.emit("GAME_FINISHED", { isWinner: true, winnerID: socket.id }); // oyun bitti state i, uida nasil gozuksun ona bak, 3. kisiyi eklemesin arraye, ayirmaya baslariz
    }
  });

  socket.on("GAME_RESTART", () => {});

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
