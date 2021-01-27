import React from "react";

function NewGame({ isShowButton, onButtonClicked }) {
  return isShowButton ? (
    <div className="newGameButton">
      <button id="newGame" onClick={onButtonClicked}>
        New Game
      </button>
    </div>
  ) : null;
}

export default NewGame;
