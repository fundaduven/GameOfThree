import React from "react";

function WinnerTitle({ winnerID, socketId, isWinner }) {
  let winnerTitle;

  if (winnerID === socketId) {
    winnerTitle = (
      <img
        className="title"
        alt="winner"
        src="https://blog.ipleaders.in/wp-content/uploads/2019/10/CKTB-News-Hospice-Niagara-Draw.jpg"
      />
    );
  } else if (isWinner && winnerID !== socketId) {
    winnerTitle = (
      <img
        className="title"
        alt="loser"
        src="https://vignette4.wikia.nocookie.net/adventuretimewithfinnandjake/images/7/77/S2e16_You_lose.png/revision/latest?cb=20141109223427"
      />
    );
  } else {
    winnerTitle = null;
  }
  return winnerTitle;
}

export default WinnerTitle;
