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
let HISTORY = [];
let user1 = "";
let user2 = "";

io.on("connection", (socket) => {
  if (user1 === "") {
    user1 = socket.id;
  } else if (user2 === "") {
    user2 = socket.id;
  }
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
    const oldNumber = NUMBER;
    NUMBER = Math.floor((NUMBER + Number(msg.moveNumber)) / 3);
    console.log("New number is", NUMBER);
    const foundPlayer = PLAYERS.find((player) => {
      return player.id === socket.id;
    });
    const otherPlayer = PLAYERS.find((player) => player.id !== foundPlayer.id);
    const userName = user1 === socket.id ? "First Player" : "Second Player";

    const history = [
      {
        number: oldNumber,
        moveNumber: Number(msg.moveNumber),
        newNumber: NUMBER,
        id: socket.id,
        username: userName,
      },
    ];

    HISTORY = [...HISTORY, ...history];

    foundPlayer.socket.emit("GAME_UPDATED", {
      number: NUMBER,
      canPlay: false,
      history: HISTORY,
    });
    otherPlayer.socket.emit("GAME_UPDATED", {
      number: NUMBER,
      canPlay: true,
      history: HISTORY,
    });

    if (NUMBER <= WINNING_NUMBER) {
      console.log("oyun bitti mi?");
      io.emit("GAME_FINISHED", { isWinner: true, winnerID: socket.id });
    }
  });

  socket.on("GAME_RESTART", () => {
    console.log("GAME_RESTART geldi mi");

    NUMBER = Math.floor(Math.random() * 1000);
    HISTORY = [];
    const restartState = {
      number: NUMBER,
      isWinner: null,
      winnerID: null,
      history: HISTORY,
    };
    PLAYERS[0].socket.emit("GAME_RESTARTED", {
      isStarted: true,
      canPlay: true,
      number: restartState.number,
      isWinner: restartState.isWinner,
      winnerID: restartState.winnerID,
      history: restartState.history,
    });
    PLAYERS[1].socket.emit("GAME_RESTARTED", {
      isStarted: true,
      canPlay: false,
      ...restartState,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
