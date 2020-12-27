import { MultiPlayerMatch } from '../multi-player/multi-player';
import { GameMode, Players, MatchResult } from '../match/match';
import { startMatch } from './start-match';
import { DiscordClient } from '../../util/discord-client';
import { TextChannel, User } from 'discord.js';
import { runInThisContext } from 'vm';

export class GlobalMatch extends MultiPlayerMatch {
  gameMode: GameMode.TEST_MATCH;

  protected startMatch = startMatch;

  constructor(
    client: DiscordClient,
    stadium: TextChannel,
    challenger: User,
    opponent: User,
    matchEndedCb: () => void
  ) {
    super(client, stadium, challenger, matchEndedCb);
    this.opponent = opponent;
    this.startGlobal();
  }

  start() {} // Overridden
  protected startGlobal() {
    this.opponent.send(`Match found. Your opponent is **${this.challenger.username}**`);
    this.challenger.send(`Match found. Your opponent is **${this.opponent.username}**`);
    this.startMatch();
  }

  protected comment(commentry: string) {
    this.opponent.send(`**Commentator**: ${commentry}`);
    this.challenger.send(`**Commentator**: ${commentry}`);
  }

  protected sendScoreBoard() {
    this.scoreboard = this.generateScoreBoard();

    // Convert @mentions to usernames
    const openerFieldIndex = this.scoreboard.fields.findIndex(field => field.name === 'Opener');
    this.scoreboard.fields[openerFieldIndex].value = this.opener ? (this.opener === Players.OPPONENT ? `**${this.opponent.username}**` : `**${this.challenger.username}**`) : ':question:';

    const chaserFieldIndex = this.scoreboard.fields.findIndex(field => field.name === 'Chaser');
    this.scoreboard.fields[chaserFieldIndex].value = this.opener ? (this.opener === Players.CHALLENGER ? `**${this.opponent.username}**` : `**${this.challenger.username}**`) : ':question:';

    const resultFieldIndex = this.scoreboard.fields.findIndex(field => field.name === 'Result');
    switch (this.result) {
      case MatchResult.OPPONENT_WON:
        this.scoreboard.fields[resultFieldIndex].value = `**${this.opponent.username}** won! :trophy:`;
        break;
      case MatchResult.CHALLENGER_WON:
        this.scoreboard.fields[resultFieldIndex].value = `**${this.challenger.username}** won! :trophy:`;
        break;
      case MatchResult.CHALLENGER_FORFEITED:
        this.scoreboard.fields[resultFieldIndex].value = `**${this.challenger.username}> forfeited :expressionless:`;
        break;
      case MatchResult.OPPONENT_FORFEITED:
        this.scoreboard.fields[resultFieldIndex].value = `**${this.opponent.username}>** forfeited :expressionless:`;
        break;
      case MatchResult.CHALLENGER_LEFT:
        this.scoreboard.fields[resultFieldIndex].value = `**${this.challenger.username}>** left the match :(`;
        break;
      case MatchResult.OPPONENT_LEFT:
        this.scoreboard.fields[resultFieldIndex].value = `**${this.opponent.username}>** left the match :(`;
        break;
    }

    this.challenger.send(this.scoreboard);
    this.opponent.send(this.scoreboard);
  }

  addMatchToDB() {
    this.client.matchesDB.addMatch('global');
  }

  sendAdvertisement() {} // Current advertisement is about global matches so don't send.
}
