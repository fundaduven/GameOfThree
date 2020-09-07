import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css'

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
      winnerTitle = <h1 className= 'animate__animated animate__zoomInDown animate__infinite animate__slow'> YOU ARE THE WINNER!!! </h1> } else if (this.state.isWinner && (this.state.winnerID !== socket.id)){
      winnerTitle = <h1 className='animate__animated animate__zoomOutDown animate__infinite animate__slower dark-red'>Sorry... You lost. </h1>
     } else {
      winnerTitle = <p className='baskerville'> Who will be the winner? </p>
   }

    return (
      <div>
       <p className= 'bg-light-green avenir dib br4 b--dashed b--black-60 pa3 ma2 grow bw2 shadow-5 f3 b' id='p1'> IT'S TIME TO {this.state.isStarted ? 'PLAY' : 'WAIT'} </p>
        {this.state.isStarted ? 
        <div>
         <p className= 'grow:hover animate__animated animate__tada animate__repeat-2' id='p2'> Game number is: {this.state.number}</p> 
          <button disabled={!this.state.canPlay || this.state.isWinner} id='-1' onClick={this.onButtonClicked}>-1</button>
          <button disabled={!this.state.canPlay || this.state.isWinner} id='0'  onClick={this.onButtonClicked}>0</button>
          <button disabled={!this.state.canPlay || this.state.isWinner} id='+1' onClick={this.onButtonClicked}>+1</button>
        </div>
        : 
        <h1 className= 'i light-blue'> waiting for your playfellow :) </h1>}

        <h2>{winnerTitle}</h2>
      </div>
    );
  }
}

export default App;
