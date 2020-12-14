import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { IHighScore } from '../../../src/db/high-score-db';

const rankMappingFunction = (score: IHighScore, i: number) => {
  return {
    name: `#${i+1} ${score.tag}`,
    value: `\`${score.score}\` runs.`,
    inline: true
  }
}

export function setLeaderboard(client: DiscordClient) {
  return setCommand(
    client,
    'leaderboard',
    'Leaderboard of high scores.',
    '',
    (msg: Message) => {
      const scores = client.highScoreDB.getScores();

      const singlePlayerRankFields = scores.singlePlayer.map(rankMappingFunction);
      const multiPlayerRankFields = scores.multiPlayer.map(rankMappingFunction);

      msg.channel.send(
        new MessageEmbed()
        .setTitle(`Hand Cricketer Leaderboard`)
        .setDescription(`Leaderboard of all Hand Cricketer players on discord.`)
        .addField(
          'Single Player',
          scores.singlePlayer.length > 0 ?
            'Following is the list of top single player high scores (in test match).' :
            'No scores recorded yet.',
          false)
        .addFields(singlePlayerRankFields)
        .addField(
          'Multi Player',
          scores.multiPlayer.length > 0 ?
            'Following is the list of top multi player high scores (in test match).' :
            'No scores recorded yet.',
          false
        )
        .addFields(multiPlayerRankFields)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('GREEN')
        .setTimestamp()
        .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
      )

      if (client.tourneyAd !== null) msg.channel.send(client.tourneyAd);
    }
  )
}
