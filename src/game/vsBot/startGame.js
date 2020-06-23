const toss = require('../../util/toss');
const ask = require('../../util/ask');
const askBatBowl = require('../../util/askBatBowl');
const startInnings = require('./startInnings');

function startGame(client, channel, msg) {
  const player = msg.author;
  
  ask(client, player, channel, 'Difficult Level(`easy`, `medium`, or `hard` ?)', answer => {
    let difficulty;
    switch(answer.trim().toLowerCase()) {
      case 'easy':
        difficulty = 0;
        break;
      case 'medium':
        difficulty = 1;
        break;
      case 'hard':
        difficulty = 2;
        break;
      default:
        channel.send('You didn\'t specify a difficulty, defaulting to `HARD`')
        difficulty = 2;
    }

    channel.send('Game Starting in 3 seconds.');

    setTimeout(() => toss(player, client, channel, tossWon => {
      if (tossWon) {
        const batBowl = ['bat', 'bowl'];
        const myTurn = batBowl[Math.floor(Math.random()*2)];

        channel.send(`I\'m going to ${myTurn}`);
        startInnings(client, channel, player, myTurn === 'bat', difficulty);
      }
      else {
        askBatBowl(client, player, channel, answer => {
          if (answer == 'bat') startInnings(client, channel, player, false, difficulty);
          else startInnings(client, channel, player, true, difficulty);
        })
      }
    }), 3000)

  })
}

module.exports = startGame;