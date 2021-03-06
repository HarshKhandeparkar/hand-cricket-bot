import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { send } from '../../util/rate-limited-send';

export function setStats(
  client: DiscordClient
) {
  return setCommand(
    client,
    'stats',
    'Stats about the bot.',
    '',
    async (msg: Message) => {
      const matchesPlayed = client.matchesDB.getMatches();

      const statsEmbed = new MessageEmbed()
        .setTitle('Hand Cricketer Stats')
        .addField('Servers', `\`${client.guilds.cache.array().length}\``, true)
        .addField('Users', `\`${client.guilds.cache.array().map(guild => guild.memberCount).reduce((a, b) => a + b)}\``, true)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
        .setTimestamp()
        .setColor('RED');

      if (client.dblIntegration) {
        const botStats = await client.dbl.getBot(client.user.id);
        statsEmbed.addField(`top.gg votes`, `\`${botStats.points}\``, true);

        statsEmbed
          .addField('1P Matches Played', `\`${matchesPlayed.singlePlayer}\``, true)
          .addField('2P Matches Played', `\`${matchesPlayed.multiPlayer}\``, true)
          .addField('Global Matches Played', `\`${matchesPlayed.global}\``, true)

        if (botStats.invite) statsEmbed.addField('Liked the bot?', `[Vote it!](https://top.gg/bot/${client.user.id}/vote)`);
      }
      else {
        statsEmbed
          .addField('1P Matches Played', `\`${matchesPlayed.singlePlayer}\``, true)
          .addField('2P Matches Played', `\`${matchesPlayed.multiPlayer}\``, true)
          .addField('Global Matches Played', `\`${matchesPlayed.global}\``, true)
      }

      send(<TextChannel>msg.channel, statsEmbed);
    }
  )
}
