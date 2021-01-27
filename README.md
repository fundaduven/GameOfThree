# Game of Three

A multiplayer game between two players – communicating with each other using an API.

## How to play
When a player starts, it incepts a random (whole) number and sends it to the second player as an approach of starting the game.
The receiving player can now always choose between adding one of `{-1,0,1}` to get to a number that is divisible by `3` Divide it by three. The resulting whole number is then sent back to the original sender.
The same rules are applied until one player reaches the number 0 or 1 (after the division).

## Install 

Clone the project and from terminal : 

`npm install`

then

```
cd client
npm start
```

Will start a `localhost`, open another browser window and paste the same `localhost` link. Start the game by calling :

```
cd ..
cd server
node index.js
```
