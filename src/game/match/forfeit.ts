import { Match, MatchResult } from './match';

export function forfeit(
  this: Match,
  forfeiterId: string
) {
  if (this.challenger.id === forfeiterId) {
    this.result = MatchResult.CHALLENGER_FORFEITED;
    if(this.opponent !== undefined) this.sendScoreBoard();
    this.associatedListeners.forEach(handlerName => this.client.offMsg(handlerName));
    return this.matchEndedCb();
  }
  else if (this.opponent) {
    if (this.opponent.id === forfeiterId) {
      this.result = MatchResult.OPPONENT_FORFEITED;
      if(this.opponent !== undefined) this.sendScoreBoard();
      this.associatedListeners.forEach(handlerName => this.client.offMsg(handlerName));
      return this.matchEndedCb();
    }
  }
}
