import { MessageEmbed } from 'discord.js';
import { DiscordClient } from '../util/discord-client';

export async function getAdvertisementEmbed(client: DiscordClient) {
  if (client.dblIntegration) {
    const botInfo = await client.dbl.getBot(client.user.id);

    return new MessageEmbed()
      .setTitle(`Crick-O-Dile League Season 1 :trophy:`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Hand Cricket Tournament`)
      .setTimestamp()
      .setColor('#4400cc')
      .setDescription(`
We are hosting a global Hand Cricket <:handcric:763782166202417173> tournament named the **Crick-O-Dile League**!
If you love the bot or the game, please consider participating. (it's free!)
If you are on the global leaderboard, PLEASE DO PARTICIPATE!
The tournament will be held in the [Support Server](https://discord.gg/${botInfo.support}).
`)
      .addField('Date', '5 Dec 2020', true)
      .addField('Registration Deadline', '3 Dec 2020', true)
      .addField('To participate', `[Click](https://discord.gg/${botInfo.support}) to join support server`, false)
  }
}
