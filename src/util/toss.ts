import { ask, ErrorMessages } from './ask';
import { TextChannel, User, DMChannel } from 'discord.js';
import { DiscordClient } from './discord-client';

export enum TossResult { HEADS, TAILS };
export { ErrorMessages } from './ask';

const doToss = async (
  player: User,
  client: DiscordClient,
  channel: TextChannel | DMChannel,
  tossMsg: string,
  onHandlerAdd: (handlerName: string) => void
): Promise<TossResult> => {
  try {
    const tossAnswer = await ask(client, player, channel, tossMsg, 120000, onHandlerAdd);
    switch (tossAnswer.answer.trim().toLowerCase()) {
      case 'heads':
        return TossResult.HEADS;
      case 'tails':
        return TossResult.TAILS;
      default:
        return await doToss(player, client, channel, 'Is that a joke? Should I laugh? Answer again.', onHandlerAdd);
    }
  }
  catch (e) {
    throw e;
  }
}

/**
 *
 * @param player Discord.js User object of the player who selects the toss.
 * @param client The main discord.js client object.
 * @param channel The channel in which the coin is flipped.
 */
export const toss = async (
  player: User,
  client: DiscordClient,
  channel: TextChannel | DMChannel,
  onHandlerAdd: (handlerName: string) => void
) => {
  channel.send('TOSS:');
  try {
    return await doToss(player, client, channel, 'Heads or Tails?', onHandlerAdd);
  }
  catch (e) {
    throw <ErrorMessages>e;
  }
}
