import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://127.0.0.1:4001';
const socket = socketIOClient(ENDPOINT);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      isStarted: false,
      canPlay: false,
      isWinner: false,
      winnerID: ''
    };
  }

  
  componentDidMount() {
    console.log('neredeyum')
    socket.on('GAME_CREATED', (msg) => {
      console.log('bisiler geldi', msg)
      this.setState(() => {
        return {
          number: msg.number,
          isStarted: msg.isStarted,
          canPlay: msg.canPlay
        };
      });
    })
    socket.on('GAME_UPDATED', (msg) => {
      console.log('bisiler degisti', msg)
      this.setState(() => {
        return {
          number: msg.number,
          canPlay: msg.canPlay
        };
      });
    })

    socket.on('GAME_FINISHED', (msg) => {
      console.log('oyun bitti', msg) 
      this.setState(() => {
        return {
          isWinner: msg.isWinner,
          winnerID: msg.winnerID
        }
      })
    })
  };

     onButtonClicked = (event) => {
       const playedMove = Number(event.target.id)
      console.log('basildi', playedMove) 
     socket.emit('PLAYER_MOVED', {moveNumber: playedMove});
    }

  render() {
    let winnerTitle = null;
      if (this.state.winnerID === socket.id) {
      winnerTitle = <h1> You win!</h1> } else if (!this.state.winnerID === socket.id){
      winnerTitle = <h1>You lose</h1>
     } else {
      winnerTitle = <p> Who will be the winner? </p>
   }

    return (
      <div>
       <p>IT'S TIME TO {this.state.isStarted ? 'WIN' : 'WAIT'} </p>
        {this.state.isStarted ? 
        <div>
         <p>game is starting with number: {this.state.number}</p> 
          <button disabled={!this.state.canPlay || this.state.isWinner} id='-1' onClick={this.onButtonClicked}>-1</button>
          <button disabled={!this.state.canPlay || this.state.isWinner} id='0'  onClick={this.onButtonClicked}>0</button>
          <button disabled={!this.state.canPlay || this.state.isWinner} id='+1' onClick={this.onButtonClicked}>+1</button>
        </div>
        : 
        <h1> waiting for other players</h1>}

        <h2>{winnerTitle}</h2>
      </div>
    );
  }
}

export default App;
