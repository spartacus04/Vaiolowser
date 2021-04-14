import { CommandoClient, CommandoMessage, Command } from 'discord.js-commando-it';

module.exports = class WhoMadeMeCommand extends Command {
  constructor(client : CommandoClient) {
    super(client, {
      name: 'whomademe',
      aliases: ['bot-maker', 'bot-creator'],
      memberName: 'whomademe',
      group: 'other',
      description: "Risponde con il nome del creatore"
    });
  }

  //@ts-ignore
  run(message : CommandoMessage) {
    const cinabroId = message.guild.emojis.cache.find(emoji => emoji.name === "cinabro") 
    message.say(
      `Mio padre <@!556091106358460417> e mio zio <@!465954478852669460> mi hanno creato con ${cinabroId} Altre info a https://github.com/spartacus04/Vaiolowser`
    );
  }
};
