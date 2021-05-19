import { MessageEmbed, Message, TextChannel, DMChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { IHighScore } from '../../../src/db/high-score-db';
import { ReactionMenu } from '@xenon-devs/discordjs-reaction-menu';
import { send } from '../../util/rate-limited-send';

const rankMappingFunction = (score: IHighScore, i: number) => {
  return {
    name: `#${i+1} ${score.tag.split('#')[0]}`,
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
      const singlePlayerSuperRankFields = scores.singleSuperOver.map(rankMappingFunction);
      const singlePlayerT5RankFields = scores.singleT5.map(rankMappingFunction);
      const multiPlayerRankFields = scores.multiPlayer.map(rankMappingFunction);
      const multiPlayerSuperRankFields = scores.multiSuperOver.map(rankMappingFunction);
      const multiPlayerT5RankFields = scores.multiT5.map(rankMappingFunction);


      const leaderboardMenu = new ReactionMenu(
        [
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricketer Leaderboard`)
              .setDescription(`Leaderboard of all Hand Cricketer players on discord. Click on the emojis below to navigate.`)
              .addFields([
                {name: '1.', value: 'Test Match High Scores'},
                {name: '2.', value: 'Super Over High Scores'},
                {name: '3.', value: 'T-5 High Scores'}
              ])
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          },
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricket Test Match High Scores`)
              .setDescription(
                scores.singlePlayer.length > 0 || scores.multiPlayer.length > 0 ?
                  'Following is the list of top test match high scores.' :
                  'No scores recorded yet.'
              )
              .addField('Single Player', singlePlayerRankFields.length > 0 ? '\u200b' : 'No scores recorded')
              .addFields(singlePlayerRankFields)
              .addField('Multi Player', multiPlayerRankFields.length > 0 ? '\u200b' : 'No scores recorded')
              .addFields(multiPlayerRankFields)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          },
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricket Super Over High Scores`)
              .setDescription(
                scores.singleSuperOver.length > 0 || scores.multiSuperOver.length > 0 ?
                  'Following is the list of top super over high scores.' :
                  'No scores recorded yet.'
              )
              .addField('Single Player', singlePlayerSuperRankFields.length > 0 ? '\u200b' : 'No scores recorded')
              .addFields(singlePlayerSuperRankFields)
              .addField('Multi Player', multiPlayerSuperRankFields.length > 0 ? '\u200b' : 'No scores recorded')
              .addFields(multiPlayerSuperRankFields)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          },
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricket T-5 High Scores`)
              .setDescription(
                scores.singleT5.length > 0 || scores.multiT5.length > 0 ?
                  'Following is the list of top T-5 high scores.' :
                  'No scores recorded yet.'
              )
              .addField('Single Player', singlePlayerT5RankFields.length > 0 ? '\u200b' : 'No scores recorded')
              .addFields(singlePlayerT5RankFields)
              .addField('Multi Player', multiPlayerT5RankFields.length > 0 ? '\u200b' : 'No scores recorded')
              .addFields(multiPlayerT5RankFields)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          }
        ],
        <TextChannel | DMChannel>msg.channel,
        120
      )

      leaderboardMenu.start([msg.author.id])

      if (client.advertisement !== null) send(<TextChannel>msg.channel, client.advertisement);
    }
  )
}
