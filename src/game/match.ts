import { User, TextChannel, MessageEmbed, ClientUser } from 'discord.js';
import { DiscordClient } from '../util/discord-client';
import { ErrorMessages } from '../util/ask';

export enum Players {
  CHALLENGER = 'challenger',
  OPPONENT = 'opponent'
}
export enum MatchResult {
  TIE = 'tie',
  CHALLENGER_WON = 'challenger_won',
  OPPONENT_WON = 'opponent_won'
}
export enum RoundResult {
  BATSMAN_SCORED = 'batsman_scored',
  BATSMAN_OUT = 'batsman_out'
}

export class Match {
  challenger: User;
  opponent: User | ClientUser;
  stadium: TextChannel;
  client: DiscordClient;

  opener: Players;
  result: MatchResult;
  /** Balls played in each innings */
  ballsPlayed: [number, number] = [0, 0];
  /** Number of innings that were completed */
  numInnings: number = 0;

  openerScore: number = 0;
  chaserScore: number = 0;

  constructor(client: DiscordClient, stadium: TextChannel, challenger: User) {
    this.client = client;
    this.challenger = challenger;
    this.stadium = stadium;
  }

  startMatch() { // To be overriden

  }

  getScoreBoard() {
    const scoreboard = new MessageEmbed()
    .setThumbnail(this.client.user.avatarURL())
    .setTitle('Scoreboard')
    .setTimestamp()
    .setFooter('Stats generated by Hand Cricketer', this.client.user.avatarURL())
    .addField(`Opener`, `<@${ this.opener === Players.OPPONENT ? this.opponent.id : this.challenger.id }>`, true)
    .addField(`Chaser`, `<@${ this.opener === Players.CHALLENGER ? this.opponent.id : this.challenger.id }>`, true)
    .addField(`Balls played in first innings`, this.ballsPlayed[0], true)
    .setDescription(this.numInnings === 1 ? `Mid Innings Score` : `Match End Score`)

    scoreboard.addField(`Opener's score`, this.openerScore, true);
    if (this.numInnings > 1) scoreboard.addField(`Chaser's score`, this.chaserScore, true);

    if (this.numInnings > 1) scoreboard.addField('Balls played in second innings', this.ballsPlayed[1], true);

    switch (this.result) {
      case MatchResult.TIE:
        scoreboard.addField('Result', 'It was a tie :(');
        break;
      case MatchResult.OPPONENT_WON:
        scoreboard.addField('Result', `<@${this.opponent.id}> won! :trophy:`);
        break;
      case MatchResult.CHALLENGER_WON:
        scoreboard.addField('Result', `<@${this.challenger.id}> won! :trophy:`);
    }

    return scoreboard;
  }

  async getChallengerFingers(): Promise<ErrorMessages | number> { // To be overriden
    return 3;
  }

  async getOpponentFingers(): Promise<ErrorMessages | number> { // To be overriden
    return ErrorMessages.DID_NOT_ANSWER;
  }

  async play() {
    const challengerFingers = await this.getChallengerFingers();
    const opponentFingers = await this.getOpponentFingers();

    if (challengerFingers === ErrorMessages.DID_NOT_ANSWER) return this.comment('Coward challenger did not play. Match Ended.');
    if (opponentFingers === ErrorMessages.DID_NOT_ANSWER) return this.comment('Coward opponent did not play. Match Ended.');

    this.ballsPlayed[this.numInnings]++;

    this.calculateRoundResult(
      (this.opener === Players.CHALLENGER && this.numInnings === 0) ? challengerFingers : opponentFingers,
      (this.opener === Players.CHALLENGER && this.numInnings === 0) ? opponentFingers : challengerFingers
    )
  }

  matchOver() {
    if (this.openerScore > this.chaserScore) this.result = this.opener === Players.CHALLENGER ? MatchResult.CHALLENGER_WON : MatchResult.OPPONENT_WON;
    else if (this.openerScore === this.chaserScore) this.result = MatchResult.TIE;
    else if (this.openerScore < this.chaserScore) this.result = this.opener === Players.CHALLENGER ? MatchResult.OPPONENT_WON : MatchResult.CHALLENGER_WON;

    this.stadium.send(this.getScoreBoard());
  }

  inningsOver() {
    this.numInnings++;

    if (this.numInnings === 2) this.matchOver();
    if (this.numInnings === 1) {
      this.stadium.send(this.getScoreBoard());
      this.play();
    }
  }

  /**
   * @param batsman Which player is the batsman
   * @param batsmanPlayed Number of fingers
   * @param bowlerPlayed Number of fingers
   */
  calculateRoundResult(batsmanPlayed: number, bowlerPlayed: number) {
    if (batsmanPlayed === bowlerPlayed) this.inningsOver();
    else {
      if (this.numInnings > 1) this.chaserScore += batsmanPlayed;
      else this.openerScore += batsmanPlayed;

      if (this.numInnings === 1 && this.chaserScore > this.openerScore) this.inningsOver();

      this.play();
    }
  }

  comment(commentry: string) {
    this.stadium.send(`**Commentator**: ${commentry}`);
  }
}
