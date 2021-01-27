import React from "react";

function GameScreen({
  isStarted,
  number,
  canPlay,
  isWinner,
  onButtonClicked,
  history,
}) {
  return (
    <div>
      <h1
        className=" bg-light-green avenir dib br4 b--dashed b--black-60 pa3 ma2 grow bw2 shadow-5 f3 b"
        id="p1"
      >
        IT'S TIME TO {isStarted ? "PLAY" : "WAIT"}
      </h1>
      {isStarted ? (
        <div>
          <p
            className=" grow:hover animate__animated animate__tada animate__repeat-2"
            id="p2"
          >
            Game number is: {number}
          </p>
          <div className="container">
            <button
              disabled={!canPlay || isWinner}
              id="-1"
              className="numbers"
              onClick={onButtonClicked}
            >
              -1
            </button>
            <button
              disabled={!canPlay || isWinner}
              id="0"
              className="numbers"
              onClick={onButtonClicked}
            >
              0
            </button>
            <button
              disabled={!canPlay || isWinner}
              id="+1"
              className="numbers"
              onClick={onButtonClicked}
            >
              +1
            </button>
          </div>
        </div>
      ) : (
        <h2 className="i light-blue">
          {" "}
          Waiting for your playfellow. Get ready!{" "}
        </h2>
      )}
      <h3>
        {history.map((historyItem) => {
          return (
            <div>
              {historyItem.username === "Second Player" ? (
                <div>
                  <p id="secondPlay">
                    <div className="container">
                      <img alt="avatar" src={"https://robohash.org/funda"} />
                      <div className="text">{historyItem.username}</div>
                    </div>
                    <div className="historyData">
                      The old number is: {historyItem.number} <br />
                      Move number is: {historyItem.moveNumber}
                      <br />
                      Your new game number is: {historyItem.newNumber}
                    </div>
                  </p>
                </div>
              ) : (
                <div>
                  <p id="firstPlay">
                    <div className="container">
                      <img alt="avatar" src={"https://robohash.org/mertoid"} />
                      <div className="text">{historyItem.username}</div>
                    </div>
                    <div className="historyData">
                      The old number is: {historyItem.number} <br />
                      Move number is: {historyItem.moveNumber}
                      <br />
                      Your new game number is: {historyItem.newNumber}
                    </div>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </h3>
    </div>
  );
}

export default GameScreen;
