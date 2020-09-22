import React, { Component } from "react";
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
        <h1
          className=" bg-light-green avenir dib br4 b--dashed b--black-60 pa3 ma2 grow bw2 shadow-5 f3 b"
          id="p1"
        >
          IT'S TIME TO {this.state.isStarted ? "PLAY" : "WAIT"}
        </h1>
        {this.state.isStarted ? (
          <div>
            <p
              className=" grow:hover animate__animated animate__tada animate__repeat-2"
              id="p2"
            >
              Game number is: {this.state.number}
            </p>
            <button
              disabled={!this.state.canPlay || this.state.isWinner}
              id="-1"
              className="numbers"
              onClick={this.onButtonClicked}
            >
              -1
            </button>
            <button
              disabled={!this.state.canPlay || this.state.isWinner}
              id="0"
              className="numbers"
              onClick={this.onButtonClicked}
            >
              0
            </button>
            <button
              disabled={!this.state.canPlay || this.state.isWinner}
              id="+1"
              className="numbers"
              onClick={this.onButtonClicked}
            >
              +1
            </button>
          </div>
        ) : (
          <h2 className="i light-blue">
            {" "}
            Waiting for your playfellow. Get ready!{" "}
          </h2>
        )}
        <h3>
          {this.state.history.map((historyItem) => {
            return (
              <div>
                {historyItem.username === "Second Player" ? (
                  <div>
                    <p id="secondPlay">
                      <div className="container">
                        <img alt="avatar" src={"https://robohash.org/funda"} />
                        <div className="text">{historyItem.username}</div>
                      </div>
                      The old number is: {historyItem.number} <br />
                      Move number is: {historyItem.moveNumber}
                      <br />
                      Your new game number is: {historyItem.newNumber}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p id="firstPlay">
                      <div className="container">
                        <img
                          alt="avatar"
                          src={"https://robohash.org/mertoid"}
                        />
                        <div className="text">{historyItem.username}</div>
                      </div>
                      The old number is: {historyItem.number} <br />
                      Move number is: {historyItem.moveNumber}
                      <br />
                      Your new game number is: {historyItem.newNumber}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </h3>

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

////////
function WinnerTitle({ winnerID, socketId, isWinner }) {
  let winnerTitle;
  if (winnerID === socketId) {
    winnerTitle = (
      <p className=" animate__animated animate__zoomInDown animate__infinite animate__slow blue">
        YOU ARE THE WINNER!!!
      </p>
    );
  } else if (isWinner && winnerID !== socketId) {
    winnerTitle = (
      <p className=" animate__animated animate__zoomOutDown animate__infinite animate__slower dark-red">
        Sorry... You lost.
      </p>
    );
  } else {
    winnerTitle = null;
  }
  return winnerTitle;
}

function NewGame({ isShowButton, onButtonClicked }) {
  return isShowButton ? (
    <button id="newGame" onClick={onButtonClicked}>
      New Game
    </button>
  ) : null;
}
