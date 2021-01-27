import React, { Component } from "react";
import GameScreen from "../components/GameScreen";
import WinnerTitle from "../components/WinnerTitle";
import NewGame from "../components/NewGame";
import socketIOClient from "socket.io-client";
import "./App.css";

const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      isStarted: false,
      canPlay: false,
      isWinner: false,
      winnerID: "",
      history: [],
    };
  }

  componentDidMount() {
    console.log("neredeyum");
    socket.on("GAME_CREATED", (msg) => {
      console.log("bisiler geldi", msg);
      this.setState(() => {
        return {
          number: msg.number,
          isStarted: msg.isStarted,
          canPlay: msg.canPlay,
        };
      });
    });
    socket.on("GAME_UPDATED", (msg) => {
      console.log("bisiler degisti", msg);
      this.setState(() => {
        return {
          number: msg.number,
          canPlay: msg.canPlay,
          history: msg.history,
        };
      });
    });

    socket.on("GAME_FINISHED", (msg) => {
      console.log("oyun bitti", msg);
      this.setState(() => {
        return {
          isWinner: msg.isWinner,
          winnerID: msg.winnerID,
        };
      });
    });
    socket.on("GAME_RESTARTED", (msg) => {
      console.log("GAME_RESTARTED", msg);

      this.setState(() => {
        return {
          number: msg.number,
          isStarted: msg.isStarted,
          canPlay: msg.canPlay,
          isWinner: msg.isWinner,
          winnerID: msg.winnerID,
          history: msg.history,
        };
      });
    });
  }

  onButtonClicked = (event) => {
    const playedMove = Number(event.target.id);
    console.log("basildi", playedMove);
    socket.emit("PLAYER_MOVED", { moveNumber: playedMove });
  };

  onNewGame = (event) => {
    socket.emit("GAME_RESTART");
  };

  render() {
    return (
      <div>
        <GameScreen
          isStarted={this.state.isStarted}
          number={this.state.number}
          canPlay={this.state.canPlay}
          isWinner={this.state.isWinner}
          onButtonClicked={this.onButtonClicked}
          history={this.state.history}
        />

        <WinnerTitle
          winnerID={this.state.winnerID}
          socketId={socket.id}
          isWinner={this.state.isWinner}
        />
        <NewGame
          isShowButton={this.state.isWinner}
          onButtonClicked={this.onNewGame}
        />
      </div>
    );
  }
}

export default App;
